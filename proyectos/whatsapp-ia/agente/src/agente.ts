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
}

export interface Entrada {
  contacto: string; // BSUID o teléfono
  texto: string;
  telefono?: string;
  nombrePerfil?: string;
  ahora?: Date;
}

const MAX_VUELTAS = 6;
const MENSAJE_ERROR =
  "Ara mateix no puc respondre. Una persona de l'equip et contestarà com més aviat millor. / Ahora mismo no puedo responder. Una persona del equipo te contestará lo antes posible.";

/** Cliente real de la API de Claude. */
export function clienteClaude(): CrearMensaje {
  const client = new Anthropic();
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
  if (memoria.estaPausado(contacto, ahora)) return null;

  const sesion = memoria.sesionActual(contacto, ahora, op.horasSesion);
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
        await op.avisarEquipo(`El asistente no ha podido responder a ${memoria.referencia(contacto)} (rechazo del modelo). Revisar la conversación.`);
        memoria.pausar(contacto, ahora + op.horasPausaHumano * 3_600_000);
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
            memoria, contacto, ahora, horasPausaHumano: op.horasPausaHumano, avisarEquipo: op.avisarEquipo,
          });
          resultados.push({ type: "tool_result", tool_use_id: bloque.id, content: salida });
        } catch (error) {
          resultados.push({ type: "tool_result", tool_use_id: bloque.id, content: `Error: ${(error as Error).message}`, is_error: true });
        }
      }
      anadir({ role: "user", content: resultados });
    }
  } catch (error) {
    await op.avisarEquipo(`Error del asistente con ${memoria.referencia(contacto)}: ${(error as Error).message}`);
    memoria.cerrarSesion(sesion);
    return nuevo ? conAviso(MENSAJE_ERROR) : MENSAJE_ERROR;
  }

  if (!texto) texto = MENSAJE_ERROR;
  return nuevo ? conAviso(texto) : texto;
}
