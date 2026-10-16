import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cargarCalendario, estadoCentro } from "../src/calendario.ts";

const cal = cargarCalendario(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../conocimiento"));
// Fechas en hora de Madrid (octubre de 2026 = UTC+2; enero = UTC+1; julio = UTC+2)
const madrid = (iso: string) => new Date(iso);

test("jueves por la mañana: abierto", () => {
  const e = estadoCentro(cal, madrid("2026-10-15T10:30:00+02:00"));
  assert.equal(e.abierto, true);
  assert.equal(e.franjasHoy, "9:00-13:00 i 15:00-19:00");
});

test("jueves a mediodía: cerrado hasta las 15:00", () => {
  const e = estadoCentro(cal, madrid("2026-10-15T13:30:00+02:00"));
  assert.equal(e.abierto, false);
  assert.equal(e.proximaApertura, "avui a les 15:00");
});

test("viernes por la tarde: cerrado hasta el lunes a las 9", () => {
  const e = estadoCentro(cal, madrid("2026-10-16T16:00:00+02:00"));
  assert.equal(e.abierto, false);
  assert.equal(e.proximaApertura, "dilluns 19/10/2026 a les 9:00");
});

test("22 y 23 de diciembre abiertos; 24 cerrado y reapertura el 4 de enero", () => {
  assert.equal(estadoCentro(cal, madrid("2026-12-22T10:00:00+01:00")).abierto, true);
  assert.equal(estadoCentro(cal, madrid("2026-12-23T10:00:00+01:00")).abierto, true);
  const e = estadoCentro(cal, madrid("2026-12-24T10:00:00+01:00"));
  assert.equal(e.abierto, false);
  assert.equal(e.motivoCierreHoy, "Nadal");
  assert.equal(e.proximaApertura, "dilluns 04/01/2027 a les 9:00");
});

test("jornada intensiva de julio de 2027: de 8:30 a 15:30", () => {
  const e = estadoCentro(cal, madrid("2027-07-01T08:45:00+02:00"));
  assert.equal(e.abierto, true);
  assert.equal(e.franjasHoy, "8:30-15:30");
  assert.equal(estadoCentro(cal, madrid("2027-07-01T16:00:00+02:00")).abierto, false);
});

test("15 de septiembre de 2027 (fiesta local de Torredembarra) se abre", () => {
  assert.equal(estadoCentro(cal, madrid("2027-09-15T10:00:00+02:00")).abierto, true);
});

test("avisa de los cierres de los próximos 30 días", () => {
  const e = estadoCentro(cal, madrid("2026-11-20T10:00:00+01:00"));
  assert.ok(e.cierresProximos.some((c) => c.includes("07/12/2026")));
});
