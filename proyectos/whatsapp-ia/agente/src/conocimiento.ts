import fs from "node:fs";
import path from "node:path";

export interface Curso {
  codigo: string;
  nombre_curso: string;
  programa: string;
  organismo: string;
  colectivo: string;
  nivel: string;
  horas: string;
  horas_practicas: string;
  plazas_por_grupo: string;
  grupos: string;
  fecha_inicio: string;
  fecha_fin: string;
  horario: string;
  sede: string;
  modalidad: string;
  estado: string;
  enlace_programa: string;
  observaciones: string;
}

/** Lector de CSV con separador «;» y comillas dobles (formato que genera Python y Excel). */
export function leerCsv(texto: string, sep = ";"): Record<string, string>[] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); campo = "";
      if (fila.some((x) => x !== "")) filas.push(fila);
      fila = [];
    } else campo += c;
  }
  fila.push(campo);
  if (fila.some((x) => x !== "")) filas.push(fila);
  const [cabecera, ...resto] = filas;
  return resto.map((f) => Object.fromEntries(cabecera.map((k, i) => [k.trim(), (f[i] ?? "").trim()])));
}

export function cargarOferta(dirConocimiento: string): Curso[] {
  const texto = fs.readFileSync(path.join(dirConocimiento, "oferta-2026-27.csv"), "utf8").replace(/^﻿/, "");
  return leerCsv(texto) as unknown as Curso[];
}

const ESTADOS: Record<string, string> = {
  aprobado: "APROVAT",
  pendiente_resolucion: "PREVIST, pendent de resolució de l'organisme",
};

/** Resumen compacto de la oferta, agrupado por programa, para las instrucciones del agente. */
export function textoOferta(cursos: Curso[]): string {
  const porPrograma = new Map<string, Curso[]>();
  for (const c of cursos) {
    if (!ESTADOS[c.estado]) continue; // nunca se muestra un curso sin estado conocido
    porPrograma.set(c.programa, [...(porPrograma.get(c.programa) ?? []), c]);
  }
  const bloques: string[] = [];
  for (const [programa, lista] of porPrograma) {
    const c0 = lista[0];
    const lineas = lista.map((c) => {
      const detalles = [
        c.nivel && `nivell ${c.nivel}`,
        c.horas && `${c.horas} h${c.horas_practicas ? ` + ${c.horas_practicas} h pràctiques (a confirmar)` : ""}`,
        c.plazas_por_grupo && `${c.plazas_por_grupo} places per grup`,
        c.enlace_programa && `fitxa: ${c.enlace_programa}`,
        c.observaciones,
      ].filter(Boolean).join("; ");
      return `- ${c.codigo.replace(/^FC01_/, "").replace(/_\d+$/, "")} · ${c.nombre_curso}${detalles ? ` (${detalles})` : ""}`;
    });
    bloques.push(
      `### ${programa}\nEstat: ${ESTADOS[c0.estado]} · Col·lectiu: ${c0.colectivo} · Modalitat: ${c0.modalidad} · Seu: ${c0.sede} · Inici: ${c0.fecha_inicio || "a confirmar"}\n${lineas.join("\n")}`,
    );
  }
  return bloques.join("\n\n");
}
