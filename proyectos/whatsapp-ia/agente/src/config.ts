import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));

function entero(valor: string | undefined, porDefecto: number): number {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? n : porDefecto;
}

export type Esfuerzo = "low" | "medium" | "high";

export const config = {
  // Modelo de IA: Claude Opus 5.5 por defecto. Cambiarlo es una decisión de gerencia tras el piloto.
  modelo: process.env.MODELO_IA ?? "claude-opus-5-5",
  esfuerzo: (process.env.ESFUERZO_IA ?? "medium") as Esfuerzo,
  maxTokens: entero(process.env.MAX_TOKENS, 8000),

  dirDatos: process.env.DIR_DATOS ?? path.resolve(aqui, "../datos"),
  dirConocimiento: process.env.DIR_CONOCIMIENTO ?? path.resolve(aqui, "../../conocimiento"),
  urlPrivacidad: process.env.URL_PRIVACIDAD ?? "https://www.multimediatarragona.com/politica-de-privadesa/",

  // Una conversación nueva empieza tras este tiempo sin mensajes.
  horasSesion: entero(process.env.HORAS_SESION, 24),
  // Si alguien del equipo contesta desde el móvil, el agente calla durante este tiempo.
  horasPausaHumano: entero(process.env.HORAS_PAUSA_HUMANO, 24),
  // Plazo de conservación de conversaciones (a validar con el DPD).
  diasConservacion: entero(process.env.DIAS_CONSERVACION, 180),

  whatsapp: {
    apiBase: process.env.WHATSAPP_API_BASE ?? "https://graph.facebook.com/v26.0",
    token: process.env.WHATSAPP_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    appSecret: process.env.WHATSAPP_APP_SECRET ?? "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "",
  },
  // Cuenta para el pago de los cursos ACTIC y persona que da el acceso al Moodle.
  ibanActic: process.env.IBAN_ACTIC ?? "ES57 0049 4365 5928 1004 1744",
  responsableActic: process.env.RESPONSABLE_ACTIC ?? "responsable de ACTIC",
  // Flujo de Workflows de Teams que publica los avisos en el canal del equipo.
  teamsWebhookUrl: process.env.TEAMS_WEBHOOK_URL ?? "",
  puerto: entero(process.env.PUERTO, 3000),
};
