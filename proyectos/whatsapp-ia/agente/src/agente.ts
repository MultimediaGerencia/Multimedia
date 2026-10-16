import Anthropic from "@anthropic-ai/sdk";
import { estadoCentro, notaEstado, type Calendario } from "./calendario.ts";
import { ejecutarHerramienta, herramientas } from "./herramientas.ts";
import type { Memoria } from "./memoria.ts";
import { avisoInicial } from "./prompt.ts";
import type { Esfuerzo } from "./config.ts";

type Peticion = Anthropic.Beta.MessageCreateParamsNonStreaming;
type Respuesta = Anthropic.Beta.BetaMessage;
export type CrearMensaje = (p: Peticion) => Promise<Respuesta>;

export interface OpcionesAgente {
  crear: CrearMensaje;
  memoria: Memoria;
  calendario: Calendario;
  instrucciones: string;
  modelo: string;
  esfuerzo: Esfuerzo;
  maxTokens: number;
  urlPrivacidad: string;
  horasSesion: number;
  horasPausaHumano: number;
  avisarEquipo: (texto: string) => Promise<void> | void;
  ibanActic?: string;
  responsableActic?: string;
}

export interface Entrada {
  contacto: string; // BSUID o teléfono
  texto: string;
  telefono?: string;
  nombrePerfil?: string;
  ahora?: Date;
}

const MAX_VUELTAS = 6;
/** Mensaje que, por sí solo, pide hablar con una persona: PERSONA, persona, «Persona.», etc. */
export const PIDE_PERSONA = /^\s*\*?persona\*?[\s.!¡?¿]*$/i;

function cuandoContestan(op: OpcionesAgente, ahora: number): string {
  const e = estadoCentro(op.calendario, new Date(ahora));
  if (e.abierto) return "Et respondrà al més aviat possible. / Te responderá lo antes posible.";
  const ca = e.proximaApertura ?? "quan el centre obri";
  const es = ca.replace("avui", "hoy").replace(" a les ", " a las ")
    .replace(/^(diumenge|dilluns|dimarts|dimecres|dijous|divendres|dissabte)/, (d) => ({ diumenge: "domingo", dilluns: "lunes", dimarts: "martes", dimecres: "miércoles", dijous: "jueves", divendres: "viernes", dissabte: "sábado" })[d]!);
  return `Ara el centre és tancat: et respondrà ${ca}. / Ahora el centro está cerrado: te responderá ${es}.`;
}

/** Mensaje que menciona documentos de identidad o de salud: aunque la conversación esté en pausa, se avisa de no enviarlos. */
export const MENCIONA_DOCUMENTOS = /\b(dni|nie|pasaporte|passaport|documento de identidad|document d'identitat|tarjeta sanitaria|targeta sanit[àa]ria|informe m[ée]dico|informe m[èe]dic|certificado de discapacidad|certificat de discapacitat)\b/i;

export const AVISO_DOCUMENTOS =
  "Si us plau, no enviïs documents d'identitat ni dades de salut per WhatsApp: l'equip t'indicarà com fer-ho de manera segura. / Por favor, no envíes documentos de identidad ni datos de salud por WhatsApp: el equipo te indicará cómo hacerlo de forma segura.";

const MENSAJE_ERROR =
  "Ara mateix no puc respondre. Una persona de l'equip et contestarà com més aviat millor. / Ahora mismo no puedo responder. Una persona del equipo te contestará lo antes posible.";

/** Traduce un error técnico de la API a un motivo breve en castellano para el aviso al equipo. */
export function motivoError(error: unknown): string {
  const estado = (error as { status?: number }).status;
  if (estado === 401 || estado === 403) return "clave de la API no válida o sin permisos";
  if (estado === 429) return "límite de uso o de gasto de la API alcanzado";
  if (estado === 400) return "petición rechazada por la API";
  if (estado !== undefined && estado >= 500) return "servicio de la IA no disponible temporalmente";
  const nombre = (error as Error)?.name ?? "";
  if (/Connection|Timeout/i.test(nombre)) return "sin conexión con el servicio de la IA";
  if (/api[_ ]?key|apiKey|authentication/i.test(String((error as Error)?.message))) return "falta la clave de la API (CLAVE_CLAUDE o ANTHROPIC_API_KEY)";
  return "error interno del asistente";
}

/**
 * Cliente real de la API de Claude. Acepta la clave en CLAVE_CLAUDE (para entornos que reservan
 * ANTHROPIC_API_KEY, como las sesiones de Claude Code en la nube) o en ANTHROPIC_API_KEY.
 */
export function clienteClaude(): CrearMensaje {
  const client = new Anthropic({ apiKey: process.env.CLAVE_CLAUDE || process.env.ANTHROPIC_API_KEY || null });
  return (p) => client.beta.messages.create(p);
}

/**
 * Procesa un mensaje entrante y devuelve el texto a enviar, o null si el agente no debe
 * responder (porque una persona del equipo lleva la conversación).
 */
export async function responder(op: OpcionesAgente, entrada: Entrada): Promise<string | null> {
  const ahora = (entrada.ahora ?? new Date()).getTime();
  const memoria = op.memoria;
  const contacto = entrada.contacto;
  memoria.asegurarContacto(contacto, ahora, entrada.telefono, entrada.nombrePerfil);
  const nuevo = memoria.necesitaAviso(contacto);
  if (memoria.estaPausado(contacto, ahora)) {
    // El equipo lleva la conversación, pero el aviso de no enviar documentos no puede esperar.
    return MENCIONA_DOCUMENTOS.test(entrada.texto) ? AVISO_DOCUMENTOS : null;
  }

  const sesion = memoria.sesionActual(contacto, ahora, op.horasSesion);

  if (PIDE_PERSONA.test(entrada.texto)) {
    // Lo resuelve el programa, sin pasar por el modelo: más fiable y sin coste.
    const respuesta = `D'acord, et passo amb una persona de l'equip. / De acuerdo, te paso con una persona del equipo.\n${cuandoContestan(op, ahora)}`;
    memoria.anadir(sesion, { role: "user", content: entrada.texto }, ahora);
    memoria.anadir(sesion, { role: "assistant", content: respuesta }, ahora);
    memoria.registrarDerivacion({ contacto, motivo: "lo_pide", resumen: "Ha escrito PERSONA", urgente: false }, ahora);
    memoria.pausar(contacto, ahora + op.horasPausaHumano * 3_600_000);
    await op.avisarEquipo(`Conversación derivada (lo_pide) · ${memoria.referencia(contacto)}: ha escrito PERSONA`);
    if (nuevo) memoria.marcarAvisado(contacto);
    return nuevo ? `${avisoInicial(op.urlPrivacidad)}\n\n${respuesta}` : respuesta;
  }

  const mensajes = memoria.historial(sesion);
  const anadir = (m: Anthropic.Beta.BetaMessageParam) => {
    mensajes.push(m);
    memoria.anadir(sesion, m, ahora);
  };

  anadir({ role: "user", content: entrada.texto });
  // Contexto que cambia en cada mensaje: va después del mensaje del usuario para no romper la caché.
  anadir({ role: "system", content: notaEstado(estadoCentro(op.calendario, new Date(ahora))) + (nuevo ? "\nÉs el primer missatge d'aquest contacte: el sistema ja li envia l'avís d'IA i privacitat, no el repeteixis." : "") });

  const conAviso = (t: string) => {
    memoria.marcarAvisado(contacto);
    return `${avisoInicial(op.urlPrivacidad)}\n\n${t}`;
  };

  let texto = "";
  try {
    for (let vuelta = 0; vuelta < MAX_VUELTAS; vuelta++) {
      const r = await op.crear({
        model: op.modelo,
        max_tokens: op.maxTokens,
        betas: ["server-side-fallback-2026-07-01", "thinking-binding-controls-2026-08-01"],
        fallbacks: "default",
        thinking: { type: "adaptive", block_binding: { prefix_mismatch_behavior: "drop_block" } },
        output_config: { effort: op.esfuerzo },
        system: [{ type: "text", text: op.instrucciones, cache_control: { type: "ephemeral", ttl: "1h" } }],
        cache_control: { type: "ephemeral" },
        tools: herramientas,
        messages: mensajes,
      });

      if (r.stop_reason === "refusal") {
        // No se pausa al contacto: si vuelve a escribir, empieza una conversación nueva.
        await op.avisarEquipo(`El asistente no ha podido responder a ${memoria.referencia(contacto)} (rechazo del modelo). Revisar la conversación; el asistente sigue atendiendo.`);
        memoria.cerrarSesion(sesion);
        return nuevo ? conAviso(MENSAJE_ERROR) : MENSAJE_ERROR;
      }

      anadir({ role: "assistant", content: r.content });
      texto = r.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n").trim();

      if (r.stop_reason === "pause_turn") continue;
      if (r.stop_reason !== "tool_use") break;

      const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const bloque of r.content) {
        if (bloque.type !== "tool_use") continue;
        try {
          const salida = await ejecutarHerramienta(bloque.name, bloque.input, {
            memoria, contacto, ahora, horasPausaHumano: op.horasPausaHumano, avisarEquipo: op.avisarEquipo, iban: op.ibanActic, responsableActic: op.responsableActic,
          });
          resultados.push({ type: "tool_result", tool_use_id: bloque.id, content: salida });
        } catch (error) {
          resultados.push({ type: "tool_result", tool_use_id: bloque.id, content: `Error: ${(error as Error).message}`, is_error: true });
        }
      }
      anadir({ role: "user", content: resultados });
    }
  } catch (error) {
    console.error("Error del asistente:", error);
    await op.avisarEquipo(`El asistente no ha podido responder a ${memoria.referencia(contacto)} (${motivoError(error)}). Revisar la conversación.`);
    memoria.cerrarSesion(sesion);
    return nuevo ? conAviso(MENSAJE_ERROR) : MENSAJE_ERROR;
  }

  if (!texto) texto = MENSAJE_ERROR;
  return nuevo ? conAviso(texto) : texto;
}
