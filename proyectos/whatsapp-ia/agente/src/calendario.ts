import fs from "node:fs";
import path from "node:path";

type Franja = [string, string];

export interface Calendario {
  zona_horaria: string;
  horario_habitual: Record<string, Franja[]>;
  jornada_intensiva: { desde: string; hasta: string; franjas: Franja[] }[];
  cierres: { desde: string; hasta: string; motivo: string }[];
}

export interface EstadoCentro {
  ahora: string; // "dijous 16/10/2026 10:30"
  abierto: boolean;
  franjasHoy: string; // "9:00-13:00 i 15:00-19:00" o "tancat"
  motivoCierreHoy?: string;
  proximaApertura?: string; // "dilluns 19/10/2026 a les 9:00"
  cierresProximos: string[];
}

const DIES = ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"];

export function cargarCalendario(dirConocimiento: string): Calendario {
  return JSON.parse(fs.readFileSync(path.join(dirConocimiento, "calendario.json"), "utf8")) as Calendario;
}

/** Fecha (AAAA-MM-DD) y minutos desde medianoche en la zona horaria del centro. */
function partesLocales(fecha: Date, zona: string): { dia: string; minutos: number } {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: zona, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(fecha).map((x) => [x.type, x.value]),
  );
  return { dia: `${p.year}-${p.month}-${p.day}`, minutos: Number(p.hour) * 60 + Number(p.minute) };
}

function sumarDias(dia: string, n: number): string {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

function diaSemana(dia: string): number {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay();
}

function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function hora(hhmm: string): string {
  return hhmm.replace(/^0/, "");
}

function fechaLarga(dia: string): string {
  const [a, m, d] = dia.split("-");
  return `${DIES[diaSemana(dia)]} ${d}/${m}/${a}`;
}

export function cierreDelDia(cal: Calendario, dia: string): string | undefined {
  return cal.cierres.find((c) => c.desde <= dia && dia <= c.hasta)?.motivo;
}

export function franjasDelDia(cal: Calendario, dia: string): Franja[] {
  if (cierreDelDia(cal, dia)) return [];
  const ds = diaSemana(dia);
  if (ds === 0 || ds === 6) return [];
  const intensiva = cal.jornada_intensiva.find((j) => j.desde <= dia && dia <= j.hasta);
  if (intensiva) return intensiva.franjas;
  return cal.horario_habitual[String(ds)] ?? [];
}

export function estadoCentro(cal: Calendario, fecha: Date): EstadoCentro {
  const { dia, minutos } = partesLocales(fecha, cal.zona_horaria);
  const hoy = franjasDelDia(cal, dia);
  const abierto = hoy.some(([i, f]) => aMinutos(i) <= minutos && minutos < aMinutos(f));

  let proximaApertura: string | undefined;
  if (!abierto) {
    for (let n = 0; n <= 45 && !proximaApertura; n++) {
      const d = sumarDias(dia, n);
      const inicio = franjasDelDia(cal, d).find(([i]) => n > 0 || aMinutos(i) > minutos);
      if (inicio) proximaApertura = `${n === 0 ? "avui" : fechaLarga(d)} a les ${hora(inicio[0])}`;
    }
  }

  const limite = sumarDias(dia, 30);
  const cierresProximos = cal.cierres
    .filter((c) => c.hasta >= dia && c.desde <= limite)
    .map((c) => (c.desde === c.hasta ? `${fechaLarga(c.desde)}: ${c.motivo}` : `del ${fechaLarga(c.desde)} al ${fechaLarga(c.hasta)}: ${c.motivo}`));

  const [hh, mm] = [Math.floor(minutos / 60), minutos % 60];
  return {
    ahora: `${fechaLarga(dia)} ${hh}:${String(mm).padStart(2, "0")}`,
    abierto,
    franjasHoy: hoy.length ? hoy.map(([i, f]) => `${hora(i)}-${hora(f)}`).join(" i ") : "tancat",
    motivoCierreHoy: cierreDelDia(cal, dia),
    proximaApertura,
    cierresProximos,
  };
}

/** Nota de contexto que se añade tras cada mensaje del usuario. */
export function notaEstado(e: EstadoCentro): string {
  const lineas = [
    `Data i hora actuals al centre: ${e.ahora}.`,
    `Horari d'avui: ${e.franjasHoy}${e.motivoCierreHoy ? ` (${e.motivoCierreHoy})` : ""}.`,
    e.abierto ? "Ara el centre és obert: l'equip pot respondre avui." : `Ara el centre és tancat. Propera obertura: ${e.proximaApertura ?? "consultar"}.`,
  ];
  if (e.cierresProximos.length) lineas.push(`Tancaments propers: ${e.cierresProximos.join("; ")}.`);
  return lineas.join("\n");
}
