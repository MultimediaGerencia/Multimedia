import type Anthropic from "@anthropic-ai/sdk";
import type { Memoria } from "./memoria.ts";

export const herramientas: Anthropic.Beta.BetaTool[] = [
  {
    name: "registrar_interesado",
    description:
      "Registra a una persona interesada en un curso o programa para que el equipo la contacte o la avise. Úsala solo cuando la persona quiera que se le informe o reserve plaza y después de saber su nombre.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nombre: { type: "string", description: "Nombre de la persona tal como lo ha dicho" },
        curso_interes: { type: "string", description: "Curso, programa o área que le interesa" },
        situacion_laboral: { type: "string", enum: ["en_paro", "trabajando", "otra", "no_indicada"] },
        idioma: { type: "string", enum: ["ca", "es", "otro"] },
        acepta_avisos: { type: "boolean", description: "true solo si ha aceptado expresamente recibir avisos de nuevas convocatorias por WhatsApp" },
      },
      required: ["nombre", "curso_interes", "situacion_laboral", "idioma", "acepta_avisos"],
    },
  },
  {
    name: "derivar_a_persona",
    description:
      "Pasa la conversación a una persona del equipo. A partir de ese momento el asistente deja de responder a este contacto hasta que el equipo lo libere.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        motivo: { type: "string", enum: ["lo_pide", "queja_o_pago", "datos_sensibles", "empresa", "actic", "sin_informacion", "otro"] },
        resumen: { type: "string", description: "Resumen breve para el equipo, sin datos de salud ni de documentos de identidad" },
        urgente: { type: "boolean" },
      },
      required: ["motivo", "resumen", "urgente"],
    },
  },
  {
    name: "registrar_baja",
    description: "Registra que la persona no quiere recibir más avisos ni comunicaciones por WhatsApp.",
    strict: true,
    input_schema: { type: "object", additionalProperties: false, properties: {}, required: [] },
  },
];

export interface ContextoHerramienta {
  memoria: Memoria;
  contacto: string;
  ahora: number;
  horasPausaHumano: number;
  avisarEquipo: (texto: string) => Promise<void> | void;
}

export async function ejecutarHerramienta(nombre: string, entrada: unknown, ctx: ContextoHerramienta): Promise<string> {
  const e = (entrada ?? {}) as Record<string, unknown>;
  switch (nombre) {
    case "registrar_interesado": {
      if (typeof e.nombre !== "string" || typeof e.curso_interes !== "string") throw new Error("Faltan nombre o curso_interes");
      ctx.memoria.registrarInteresado(
        {
          contacto: ctx.contacto,
          nombre: e.nombre,
          curso_interes: e.curso_interes,
          situacion_laboral: String(e.situacion_laboral ?? "no_indicada"),
          idioma: String(e.idioma ?? "otro"),
          acepta_avisos: e.acepta_avisos === true,
        },
        ctx.ahora,
      );
      await ctx.avisarEquipo(`Nuevo interesado: ${e.nombre} · ${e.curso_interes} · ${e.situacion_laboral} · ${ctx.memoria.referencia(ctx.contacto)}`);
      return "Registrado correctamente.";
    }
    case "derivar_a_persona": {
      const resumen = String(e.resumen ?? "");
      ctx.memoria.registrarDerivacion({ contacto: ctx.contacto, motivo: String(e.motivo ?? "otro"), resumen, urgente: e.urgente === true }, ctx.ahora);
      ctx.memoria.pausar(ctx.contacto, ctx.ahora + ctx.horasPausaHumano * 3_600_000);
      await ctx.avisarEquipo(`${e.urgente === true ? "URGENTE · " : ""}Conversación derivada (${e.motivo}) · ${ctx.memoria.referencia(ctx.contacto)}: ${resumen}`);
      return "Derivado. El equipo continuará la conversación; despídete indicando cuándo le contestarán.";
    }
    case "registrar_baja": {
      ctx.memoria.darDeBaja(ctx.contacto);
      return "Baja registrada. No recibirá más avisos.";
    }
    default:
      throw new Error(`Herramienta desconocida: ${nombre}`);
  }
}
