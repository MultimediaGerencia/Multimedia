import crypto from "node:crypto";

export type Evento =
  | { tipo: "mensaje"; id: string; contacto: string; telefono?: string; nombrePerfil?: string; texto: string }
  | { tipo: "audio"; id: string; contacto: string; telefono?: string; nombrePerfil?: string; mediaId: string }
  | { tipo: "no_soportado"; id: string; contacto: string; telefono?: string; clase: string }
  | { tipo: "eco"; contacto?: string; telefono?: string };

/** Comprueba la cabecera X-Hub-Signature-256 (HMAC-SHA256 del cuerpo sin tocar con el App Secret). */
export function verificarFirma(cuerpo: Buffer, cabecera: string | undefined, secreto: string): boolean {
  if (!cabecera?.startsWith("sha256=") || !secreto) return false;
  const esperada = Buffer.from(crypto.createHmac("sha256", secreto).update(cuerpo).digest("hex"));
  const recibida = Buffer.from(cabecera.slice(7));
  return esperada.length === recibida.length && crypto.timingSafeEqual(esperada, recibida);
}

type Json = Record<string, any>;

/**
 * Convierte el aviso de Meta en eventos. Identifica a cada persona por su BSUID (`from_user_id`)
 * cuando llega y, si no, por su teléfono (`from`), que desde 2026 puede faltar.
 */
export function interpretarWebhook(cuerpo: Json): Evento[] {
  const eventos: Evento[] = [];
  for (const entrada of cuerpo?.entry ?? []) {
    for (const cambio of entrada?.changes ?? []) {
      const v: Json = cambio?.value ?? {};
      if (cambio?.field === "messages") {
        const nombres = new Map<string, string>();
        for (const c of v.contacts ?? []) {
          const nombre = c?.profile?.name;
          if (nombre) for (const k of [c.user_id, c.wa_id]) if (k) nombres.set(k, nombre);
        }
        for (const m of v.messages ?? []) {
          const contacto: string | undefined = m.from_user_id ?? m.from;
          if (!m.id || !contacto) continue;
          const base = { id: m.id as string, contacto, telefono: m.from as string | undefined, nombrePerfil: nombres.get(contacto) };
          const texto =
            m.type === "text" ? m.text?.body
            : m.type === "interactive" ? (m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title)
            : m.type === "button" ? m.button?.text
            : undefined;
          if (typeof texto === "string" && texto.trim()) eventos.push({ tipo: "mensaje", ...base, texto });
          else if (m.type === "audio" && m.audio?.id) eventos.push({ tipo: "audio", ...base, mediaId: m.audio.id });
          else eventos.push({ tipo: "no_soportado", id: base.id, contacto, telefono: base.telefono, clase: String(m.type) });
        }
      } else if (cambio?.field === "smb_message_echoes") {
        // Mensajes que el equipo ha enviado desde la app del móvil (coexistencia).
        for (const m of v.message_echoes ?? v.messages ?? []) {
          eventos.push({ tipo: "eco", contacto: m.to_user_id ?? m.recipient_user_id, telefono: m.to });
        }
      }
    }
  }
  return eventos;
}

export interface ClienteWhatsApp {
  enviarTexto(destino: string, texto: string): Promise<void>;
  marcarLeido(idMensaje: string): Promise<void>;
}

export function clienteWhatsApp(op: { apiBase: string; token: string; phoneNumberId: string }): ClienteWhatsApp {
  const llamar = async (cuerpo: Json) => {
    const r = await fetch(`${op.apiBase}/${op.phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${op.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", ...cuerpo }),
    });
    if (!r.ok) throw new Error(`WhatsApp ${r.status}: ${await r.text()}`);
  };
  return {
    // Un teléfono va en `to`; un BSUID, en `recipient`.
    enviarTexto: (destino, texto) =>
      llamar({ ...(/^\d+$/.test(destino) ? { to: destino } : { recipient: destino }), type: "text", text: { body: texto.slice(0, 4096) } }),
    marcarLeido: (idMensaje) => llamar({ status: "read", message_id: idMensaje, typing_indicator: { type: "text" } }),
  };
}
