import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type Anthropic from "@anthropic-ai/sdk";

type Mensaje = Anthropic.Beta.BetaMessageParam;

export interface Interesado {
  contacto: string;
  nombre: string;
  curso_interes: string;
  situacion_laboral: string;
  idioma: string;
  acepta_avisos: boolean;
}

export interface Derivacion {
  contacto: string;
  motivo: string;
  resumen: string;
  urgente: boolean;
}

/**
 * Memoria del agente. Los contactos se identifican por su identificador de WhatsApp
 * (BSUID cuando llega; si no, el teléfono). Las conversaciones se guardan completas y
 * solo se añade al final: Claude exige que el historial no se modifique por en medio.
 */
export class Memoria {
  private db: DatabaseSync;

  constructor(ruta: string) {
    if (ruta !== ":memory:") fs.mkdirSync(path.dirname(ruta), { recursive: true });
    this.db = new DatabaseSync(ruta);
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS contactos (
        id TEXT PRIMARY KEY, telefono TEXT, nombre_perfil TEXT,
        creado INTEGER NOT NULL, pausado_hasta INTEGER NOT NULL DEFAULT 0, baja INTEGER NOT NULL DEFAULT 0,
        avisado INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS sesiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT, contacto TEXT NOT NULL, inicio INTEGER NOT NULL, ultimo INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS mensajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, sesion INTEGER NOT NULL, contenido TEXT NOT NULL, ts INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS interesados (
        id INTEGER PRIMARY KEY AUTOINCREMENT, contacto TEXT NOT NULL, nombre TEXT, curso_interes TEXT,
        situacion_laboral TEXT, idioma TEXT, acepta_avisos INTEGER NOT NULL, ts INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS derivaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT, contacto TEXT NOT NULL, motivo TEXT, resumen TEXT,
        urgente INTEGER NOT NULL, ts INTEGER NOT NULL, atendida INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS procesados (id TEXT PRIMARY KEY, ts INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS idx_sesiones_contacto ON sesiones(contacto, ultimo);
      CREATE INDEX IF NOT EXISTS idx_mensajes_sesion ON mensajes(sesion, id);
    `);
  }

  asegurarContacto(id: string, ahora: number, telefono?: string, nombrePerfil?: string): void {
    const r = this.db
      .prepare("INSERT INTO contactos (id, telefono, nombre_perfil, creado) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING")
      .run(id, telefono ?? null, nombrePerfil ?? null, ahora);
    if (r.changes === 0 && telefono) this.db.prepare("UPDATE contactos SET telefono = ? WHERE id = ?").run(telefono, id);
  }

  /** El aviso de IA y privacidad se envía en la primera respuesta que llega a enviarse. */
  necesitaAviso(id: string): boolean {
    const r = this.db.prepare("SELECT avisado FROM contactos WHERE id = ?").get(id) as { avisado: number } | undefined;
    return !r || r.avisado === 0;
  }

  marcarAvisado(id: string): void {
    this.db.prepare("UPDATE contactos SET avisado = 1 WHERE id = ?").run(id);
  }

  /** Marca un mensaje de WhatsApp como procesado. Devuelve false si ya lo estaba (Meta reintenta). */
  marcarProcesado(idMensaje: string, ahora: number): boolean {
    return this.db.prepare("INSERT OR IGNORE INTO procesados (id, ts) VALUES (?, ?)").run(idMensaje, ahora).changes > 0;
  }

  /** Busca un contacto por teléfono (los ecos de la app pueden traer solo el teléfono). */
  idPorTelefono(telefono: string): string | undefined {
    const r = this.db.prepare("SELECT id FROM contactos WHERE telefono = ? OR id = ? LIMIT 1").get(telefono, telefono) as { id: string } | undefined;
    return r?.id;
  }

  /** Cómo identificar al contacto en los avisos al equipo: teléfono si lo hay. */
  referencia(contacto: string): string {
    const r = this.db.prepare("SELECT telefono, nombre_perfil FROM contactos WHERE id = ?").get(contacto) as { telefono: string | null; nombre_perfil: string | null } | undefined;
    const tel = r?.telefono ? `+${r.telefono}` : contacto;
    return r?.nombre_perfil ? `${r.nombre_perfil} (${tel})` : tel;
  }

  pausar(contacto: string, hasta: number): void {
    this.db.prepare("UPDATE contactos SET pausado_hasta = ? WHERE id = ?").run(hasta, contacto);
  }

  estaPausado(contacto: string, ahora: number): boolean {
    const r = this.db.prepare("SELECT pausado_hasta FROM contactos WHERE id = ?").get(contacto) as { pausado_hasta: number } | undefined;
    return !!r && r.pausado_hasta > ahora;
  }

  darDeBaja(contacto: string): void {
    this.db.prepare("UPDATE contactos SET baja = 1 WHERE id = ?").run(contacto);
    this.db.prepare("UPDATE interesados SET acepta_avisos = 0 WHERE contacto = ?").run(contacto);
  }

  /** Sesión vigente o una nueva si la última lleva más de `horas` sin actividad. */
  sesionActual(contacto: string, ahora: number, horas: number): number {
    const r = this.db
      .prepare("SELECT id, ultimo FROM sesiones WHERE contacto = ? ORDER BY ultimo DESC LIMIT 1")
      .get(contacto) as { id: number; ultimo: number } | undefined;
    if (r && ahora - r.ultimo < horas * 3_600_000) return r.id;
    return Number(this.db.prepare("INSERT INTO sesiones (contacto, inicio, ultimo) VALUES (?, ?, ?)").run(contacto, ahora, ahora).lastInsertRowid);
  }

  /** Cierra una sesión para que el próximo mensaje empiece una conversación nueva. */
  cerrarSesion(sesion: number): void {
    this.db.prepare("UPDATE sesiones SET ultimo = 0 WHERE id = ?").run(sesion);
  }

  historial(sesion: number): Mensaje[] {
    return (this.db.prepare("SELECT contenido FROM mensajes WHERE sesion = ? ORDER BY id").all(sesion) as { contenido: string }[])
      .map((r) => JSON.parse(r.contenido) as Mensaje);
  }

  anadir(sesion: number, mensaje: Mensaje, ahora: number): void {
    this.db.prepare("INSERT INTO mensajes (sesion, contenido, ts) VALUES (?, ?, ?)").run(sesion, JSON.stringify(mensaje), ahora);
    this.db.prepare("UPDATE sesiones SET ultimo = ? WHERE id = ?").run(ahora, sesion);
  }

  registrarInteresado(i: Interesado, ahora: number): void {
    this.db
      .prepare("INSERT INTO interesados (contacto, nombre, curso_interes, situacion_laboral, idioma, acepta_avisos, ts) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(i.contacto, i.nombre, i.curso_interes, i.situacion_laboral, i.idioma, i.acepta_avisos ? 1 : 0, ahora);
  }

  registrarDerivacion(d: Derivacion, ahora: number): void {
    this.db
      .prepare("INSERT INTO derivaciones (contacto, motivo, resumen, urgente, ts) VALUES (?, ?, ?, ?, ?)")
      .run(d.contacto, d.motivo, d.resumen, d.urgente ? 1 : 0, ahora);
  }

  interesados(): Record<string, unknown>[] {
    return this.db.prepare("SELECT * FROM interesados ORDER BY ts").all() as Record<string, unknown>[];
  }

  derivacionesPendientes(): Record<string, unknown>[] {
    return this.db.prepare("SELECT * FROM derivaciones WHERE atendida = 0 ORDER BY ts").all() as Record<string, unknown>[];
  }

  /** Borra conversaciones y registros técnicos más antiguos que el plazo de conservación. */
  purgar(ahora: number, dias: number): void {
    const limite = ahora - dias * 86_400_000;
    this.db.prepare("DELETE FROM mensajes WHERE sesion IN (SELECT id FROM sesiones WHERE ultimo < ?)").run(limite);
    this.db.prepare("DELETE FROM sesiones WHERE ultimo < ?").run(limite);
    this.db.prepare("DELETE FROM procesados WHERE ts < ?").run(limite);
  }
}
