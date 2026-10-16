import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type Anthropic from "@anthropic-ai/sdk";
import { motivoError, responder, type CrearMensaje, type OpcionesAgente } from "../src/agente.ts";
import { cargarCalendario } from "../src/calendario.ts";
import { Memoria } from "../src/memoria.ts";
import { procesarEvento } from "../src/servidor.ts";
import { conceptoActic } from "../src/herramientas.ts";
import { interpretarWebhook, verificarFirma, type ClienteWhatsApp } from "../src/whatsapp.ts";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../conocimiento");
type Peticion = Anthropic.Beta.MessageCreateParamsNonStreaming;

function respuesta(content: unknown[], stop_reason: string): Anthropic.Beta.BetaMessage {
  return { id: "msg", type: "message", role: "assistant", model: "claude-opus-5-5", content, stop_reason, stop_sequence: null, usage: {} } as unknown as Anthropic.Beta.BetaMessage;
}

/** Modelo simulado: devuelve las respuestas indicadas en orden y guarda las peticiones. */
function modeloFalso(guion: Anthropic.Beta.BetaMessage[]): { crear: CrearMensaje; peticiones: Peticion[] } {
  const peticiones: Peticion[] = [];
  return { peticiones, crear: async (p) => { peticiones.push(structuredClone(p)); return guion.shift()!; } };
}

function agente(crear: CrearMensaje, avisos: string[] = []): OpcionesAgente {
  return {
    crear, memoria: new Memoria(":memory:"), calendario: cargarCalendario(dir), instrucciones: "INSTRUCCIONES",
    modelo: "claude-opus-5-5", esfuerzo: "medium", maxTokens: 8000, urlPrivacidad: "https://privacidad",
    horasSesion: 24, horasPausaHumano: 24, avisarEquipo: (t) => { avisos.push(t); },
    ibanActic: "ES57 0049 4365 5928 1004 1744", responsableActic: "responsable ACTIC",
  };
}

const ahora = new Date("2026-10-15T10:30:00+02:00");

test("primer mensaje: añade el aviso de IA y la nota de contexto va tras el mensaje del usuario", async () => {
  const m = modeloFalso([respuesta([{ type: "text", text: "Hola, en què et puc ajudar?" }], "end_turn")]);
  const op = agente(m.crear);
  const texto = await responder(op, { contacto: "ES.1", texto: "Hola", ahora });
  assert.match(texto!, /intel·ligència artificial/);
  assert.match(texto!, /Hola, en què et puc ajudar\?/);
  const p = m.peticiones[0];
  assert.equal(p.model, "claude-opus-5-5");
  assert.equal(p.fallbacks, "default");
  assert.deepEqual(p.messages.map((x) => x.role), ["user", "system"]);
  assert.match(String(p.messages[1].content), /dijous 15\/10\/2026 10:30/);
});

test("segundo mensaje: sin aviso y con el historial completo (solo se añade al final)", async () => {
  const m = modeloFalso([
    respuesta([{ type: "text", text: "Primera" }], "end_turn"),
    respuesta([{ type: "text", text: "Segunda" }], "end_turn"),
  ]);
  const op = agente(m.crear);
  await responder(op, { contacto: "ES.1", texto: "Hola", ahora });
  const texto = await responder(op, { contacto: "ES.1", texto: "Quins cursos hi ha?", ahora });
  assert.equal(texto, "Segunda");
  const [p1, p2] = m.peticiones;
  assert.deepEqual(p2.messages.slice(0, p1.messages.length), p1.messages);
  assert.deepEqual(p2.messages.map((x) => x.role), ["user", "system", "assistant", "user", "system"]);
});

test("usa la herramienta registrar_interesado y avisa al equipo", async () => {
  const avisos: string[] = [];
  const m = modeloFalso([
    respuesta([{ type: "tool_use", id: "t1", name: "registrar_interesado", input: { nombre: "Laia", curso_interes: "ACTIC mitjà", situacion_laboral: "trabajando", idioma: "ca", acepta_avisos: true } }], "tool_use"),
    respuesta([{ type: "text", text: "Fet! T'hem apuntat." }], "end_turn"),
  ]);
  const op = agente(m.crear, avisos);
  const texto = await responder(op, { contacto: "ES.2", texto: "Apunta'm, soc la Laia", ahora });
  assert.match(texto!, /Fet!/);
  const [i] = op.memoria.interesados();
  assert.equal(i.nombre, "Laia");
  assert.equal(i.acepta_avisos, 1);
  assert.ok(avisos.some((a) => a.includes("Laia")));
  const ultimo = m.peticiones[1].messages.at(-1)!;
  assert.equal((ultimo.content as Anthropic.Beta.BetaToolResultBlockParam[])[0].tool_use_id, "t1");
});

test("al derivar, el agente se aparta en los siguientes mensajes", async () => {
  const m = modeloFalso([
    respuesta([{ type: "tool_use", id: "t1", name: "derivar_a_persona", input: { motivo: "lo_pide", resumen: "Quiere hablar con alguien", urgente: false } }], "tool_use"),
    respuesta([{ type: "text", text: "Et passo amb l'equip." }], "end_turn"),
  ]);
  const op = agente(m.crear);
  assert.match((await responder(op, { contacto: "ES.3", texto: "PERSONA", ahora }))!, /equip/);
  assert.equal(await responder(op, { contacto: "ES.3", texto: "Hola?", ahora }), null);
  assert.equal(m.peticiones.length, 2);
});

test("si el modelo rechaza la petición, responde con un mensaje seguro y avisa al equipo", async () => {
  const avisos: string[] = [];
  const m = modeloFalso([respuesta([], "refusal")]);
  const op = agente(m.crear, avisos);
  const texto = await responder(op, { contacto: "ES.4", texto: "...", ahora });
  assert.match(texto!, /persona de l'equip/);
  assert.match(texto!, /intel·ligència artificial/); // el aviso de IA se envía aunque falle
  assert.equal(avisos.length, 1);
});

test("si falla el primer mensaje, el aviso de IA no se repite después", async () => {
  const m = modeloFalso([respuesta([], "refusal"), respuesta([{ type: "text", text: "Ara sí" }], "end_turn")]);
  const op = agente(m.crear);
  await responder(op, { contacto: "ES.6", texto: "Hola", ahora });
  op.memoria.pausar("ES.6", 0);
  assert.equal(await responder(op, { contacto: "ES.6", texto: "Hola?", ahora }), "Ara sí");
  // la conversación fallida se cerró: la nueva empieza limpia
  assert.deepEqual(m.peticiones[1].messages.map((x) => x.role), ["user", "system"]);
});

test("firma de Meta: acepta la correcta y rechaza la manipulada", () => {
  const cuerpo = Buffer.from('{"a":1}');
  const firma = "sha256=" + crypto.createHmac("sha256", "secreto").update(cuerpo).digest("hex");
  assert.equal(verificarFirma(cuerpo, firma, "secreto"), true);
  assert.equal(verificarFirma(Buffer.from('{"a":2}'), firma, "secreto"), false);
  assert.equal(verificarFirma(cuerpo, undefined, "secreto"), false);
  assert.equal(verificarFirma(cuerpo, firma, ""), false);
});

test("interpreta mensajes con BSUID, audios y ecos de la app", () => {
  const eventos = interpretarWebhook({
    entry: [{ changes: [
      { field: "messages", value: {
        contacts: [{ profile: { name: "Laia" }, wa_id: "34600111222", user_id: "ES.99" }],
        messages: [
          { id: "w1", from: "34600111222", from_user_id: "ES.99", type: "text", text: { body: "Hola" } },
          { id: "w2", from_user_id: "ES.98", type: "audio", audio: { id: "m1" } },
          { id: "w3", from: "34600111223", type: "image", image: { id: "m2" } },
        ],
        statuses: [{ id: "x", status: "read" }],
      } },
      { field: "smb_message_echoes", value: { message_echoes: [{ to: "34600111222" }] } },
    ] }],
  });
  assert.deepEqual(eventos.map((e) => e.tipo), ["mensaje", "audio", "no_soportado", "eco"]);
  assert.equal(eventos[0].tipo === "mensaje" && eventos[0].contacto, "ES.99");
  assert.equal(eventos[0].tipo === "mensaje" && eventos[0].nombrePerfil, "Laia");
});

test("servidor: descarta duplicados de Meta y se calla si el equipo contesta desde el móvil", async () => {
  const m = modeloFalso([respuesta([{ type: "text", text: "Hola!" }], "end_turn")]);
  const op = agente(m.crear);
  const enviados: string[] = [];
  const wa: ClienteWhatsApp = { enviarTexto: async (_d, t) => { enviados.push(t); }, marcarLeido: async () => {} };
  const ev = { tipo: "mensaje" as const, id: "w1", contacto: "ES.5", telefono: "34600111222", texto: "Hola" };
  await procesarEvento(op, wa, ev);
  await procesarEvento(op, wa, ev); // reintento de Meta
  assert.equal(enviados.length, 1);
  await procesarEvento(op, wa, { tipo: "eco", telefono: "34600111222" });
  await procesarEvento(op, wa, { ...ev, id: "w2" });
  assert.equal(enviados.length, 1);
  assert.equal(m.peticiones.length, 1);
});

test("concepto ACTIC: código del nivel, año y mes del pago en hora de Madrid", () => {
  assert.equal(conceptoActic("medio", new Date("2026-10-16T10:00:00+02:00")), "AON2/2026/10");
  assert.equal(conceptoActic("avanzado", new Date("2026-09-03T10:00:00+02:00")), "AON3/2026/09");
  // El mes se calcula en hora de Madrid: el 31/12 a las 23:30 UTC ya es 1 de enero en Madrid
  assert.equal(conceptoActic("medio", new Date("2026-12-31T23:30:00+01:00")), "AON2/2026/12");
  assert.equal(conceptoActic("medio", new Date("2026-12-31T23:30:00Z")), "AON2/2027/01");
});

test("instrucciones de pago ACTIC: IBAN y concepto exactos, y aviso a la responsable", async () => {
  const avisos: string[] = [];
  const m = modeloFalso([
    respuesta([{ type: "tool_use", id: "t1", name: "instrucciones_pago_actic", input: { nivel: "avanzado", nombre: "Pau" } }], "tool_use"),
    respuesta([{ type: "text", text: "Aquí tens les dades." }], "end_turn"),
  ]);
  const op = agente(m.crear, avisos);
  await responder(op, { contacto: "ES.7", texto: "Vull pagar per transferència", ahora });
  const resultado = (m.peticiones[1].messages.at(-1)!.content as Anthropic.Beta.BetaToolResultBlockParam[])[0].content as string;
  assert.match(resultado, /IBAN: ES57 0049 4365 5928 1004 1744/);
  assert.match(resultado, /Concepto \(escríbelo exactamente así\): AON3\/2026\/10/);
  assert.match(resultado, /129 €/);
  assert.ok(avisos.some((a) => a.includes("AON3/2026/10") && a.includes("Pau")));
});

test("errores de la API: el aviso al equipo va en castellano y sin detalles técnicos", async () => {
  const avisos: string[] = [];
  const fallo = Object.assign(new Error("401 {\"type\":\"error\",\"error\":{\"type\":\"authentication_error\"}}"), { status: 401 });
  const op = agente(async () => { throw fallo; }, avisos);
  const original = console.error;
  console.error = () => {};
  try {
    assert.match((await responder(op, { contacto: "ES.8", texto: "Hola", ahora }))!, /persona de l'equip/);
  } finally {
    console.error = original;
  }
  assert.match(avisos[0], /clave de la API no válida/);
  assert.doesNotMatch(avisos[0], /authentication_error/);
  assert.equal(motivoError(Object.assign(new Error("x"), { status: 529 })), "servicio de la IA no disponible temporalmente");
  assert.equal(motivoError(new Error("Could not resolve authentication method. Expected the apiKey to be set")), "falta la clave de la API (CLAVE_CLAUDE o ANTHROPIC_API_KEY)");
});
