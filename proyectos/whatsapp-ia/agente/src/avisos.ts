import fs from "node:fs";
import path from "node:path";

/**
 * Tarjeta para un canal de Teams a través de un flujo de Workflows
 * («Publicar en un canal cuando se recibe una solicitud de webhook»).
 */
export function tarjetaTeams(texto: string): Record<string, unknown> {
  const urgente = texto.startsWith("URGENTE");
  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            { type: "TextBlock", text: "Asistente de WhatsApp", weight: "Bolder", color: urgente ? "Attention" : "Accent" },
            { type: "TextBlock", text: texto, wrap: true },
            { type: "TextBlock", text: "Responde desde la app WhatsApp Business del móvil de la oficina.", isSubtle: true, size: "Small", wrap: true },
          ],
        },
      },
    ],
  };
}

/** Avisa al equipo por Teams (si hay webhook configurado) y siempre lo apunta en el registro local. */
export function crearAvisador(op: { dirDatos: string; teamsWebhookUrl: string }) {
  const registro = path.join(op.dirDatos, "avisos-equipo.log");
  return async (texto: string): Promise<void> => {
    fs.mkdirSync(op.dirDatos, { recursive: true });
    fs.appendFileSync(registro, `${new Date().toISOString()} ${texto}\n`);
    if (!op.teamsWebhookUrl) {
      console.log(`[aviso al equipo] ${texto}`);
      return;
    }
    try {
      const r = await fetch(op.teamsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarjetaTeams(texto)),
      });
      if (!r.ok) throw new Error(`Teams ${r.status}`);
    } catch (error) {
      // Un fallo de Teams no debe impedir que el agente responda al usuario.
      fs.appendFileSync(registro, `${new Date().toISOString()} ERROR enviando a Teams: ${(error as Error).message}\n`);
    }
  };
}
