import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cargarOferta, leerCsv, textoOferta } from "../src/conocimiento.ts";
import { instrucciones } from "../src/prompt.ts";
import { cargarCalendario } from "../src/calendario.ts";
import { tarjetaTeams } from "../src/avisos.ts";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../conocimiento");

test("lee CSV con comillas y separador ;", () => {
  const filas = leerCsv('a;b\n"x;1";"di ""hola"""\n');
  assert.deepEqual(filas, [{ a: "x;1", b: 'di "hola"' }]);
});

test("carga los 30 cursos de la oferta, todos con estado conocido y en Torredembarra", () => {
  const cursos = cargarOferta(dir);
  assert.equal(cursos.length, 30);
  for (const c of cursos) {
    assert.ok(["aprobado", "pendiente_resolucion"].includes(c.estado), c.codigo);
    assert.equal(c.sede, "Torredembarra");
    assert.equal(c.modalidad, "Presencial");
  }
  assert.equal(cursos.filter((c) => c.estado === "aprobado").length, 16);
});

test("la oferta no contiene datos de docentes ni los módulos ocultos", () => {
  const texto = fs.readFileSync(path.join(dir, "oferta-2026-27.csv"), "utf8");
  assert.doesNotMatch(texto, /\b6\d{8}\b/); // teléfonos móviles
  assert.doesNotMatch(texto, /IMPE0110_MF|IMPE110_MF/);
});

test("las instrucciones marcan lo pendiente como previsto y son estables", () => {
  const cursos = cargarOferta(dir);
  const t = textoOferta(cursos);
  assert.match(t, /PREVIST, pendent de resolució/);
  assert.match(t, /APROVAT/);
  // Sin fecha ni hora dentro: si cambiaran en cada mensaje, la caché no funcionaría
  assert.equal(instrucciones(cursos, "https://x"), instrucciones(cursos, "https://x"));
  assert.doesNotMatch(instrucciones(cursos, "https://x"), /\d{2}:\d{2}:\d{2}/);
  assert.match(instrucciones(cursos, "https://x"), /Nivel medio: 109 €\. Nivel avanzado: 129 €/);
  assert.match(instrucciones(cursos, "https://x"), /«en línia» \(nunca «en línea»\)/);
  assert.match(instrucciones(cursos, "https://x"), /cópialas exactamente como aparecen en esta lista/);
  assert.match(instrucciones(cursos, "https://x"), /nivel 2 \(medio\) 27,60 €/);
});

test("la tarjeta de Teams lleva el texto y marca los urgentes", () => {
  const t = tarjetaTeams("URGENTE · Conversación derivada (queja_o_pago): ...") as any;
  const cuerpo = t.attachments[0].content.body;
  assert.equal(t.attachments[0].contentType, "application/vnd.microsoft.card.adaptive");
  assert.equal(cuerpo[0].color, "Attention");
  assert.match(cuerpo[1].text, /queja_o_pago/);
  assert.equal((tarjetaTeams("Nuevo interesado") as any).attachments[0].content.body[0].color, "Accent");
});

test("las instrucciones incluyen el calendario completo de cierres (también los lejanos)", () => {
  const texto = instrucciones(cargarOferta(dir), "https://x", cargarCalendario(dir));
  assert.match(texto, /divendres 26\/03\/2027: Divendres Sant/);
  assert.match(texto, /del dilluns 02\/08\/2027 al divendres 20\/08\/2027: Vacances d'estiu/);
  assert.match(texto, /8:30-15:30/);
});
