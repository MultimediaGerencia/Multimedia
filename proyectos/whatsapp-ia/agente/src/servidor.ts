import http from "node:http";
import { responder, type OpcionesAgente } from "./agente.ts";
import { config } from "./config.ts";
import { montarAgente } from "./montaje.ts";
import { clienteWhatsApp, interpretarWebhook, verificarFirma, type ClienteWhatsApp, type Evento } from "./whatsapp.ts";

const AUDIO_PENDIENTE =
  "Encara no puc escoltar àudios. M'ho pots escriure? / Todavía no puedo escuchar audios. ¿Me lo puedes escribir?";
const NO_SOPORTADO =
  "Només puc llegir missatges de text. Si és un document, no l'enviïs per aquí: l'equip t'indicarà com fer-ho de manera segura. / Solo puedo leer mensajes de texto. Si es un documento, no lo envíes por aquí: el equipo te indicará cómo hacerlo de forma segura.";

/** Procesa los mensajes de cada contacto en orden, uno detrás de otro. */
const colas = new Map<string, Promise<void>>();
function enCola(clave: string, tarea: () => Promise<void>): void {
  const anterior = colas.get(clave) ?? Promise.resolve();
  const siguiente = anterior.then(tarea).catch((e) => console.error(`[error] ${clave}: ${(e as Error).message}`));
  colas.set(clave, siguiente);
  void siguiente.finally(() => colas.get(clave) === siguiente && colas.delete(clave));
}

export async function procesarEvento(agente: OpcionesAgente, wa: ClienteWhatsApp, ev: Evento): Promise<void> {
  const ahora = Date.now();
  const memoria = agente.memoria;
  if (ev.tipo === "eco") {
    // Alguien del equipo ha contestado desde el móvil: el agente se aparta.
    const id = ev.contacto ?? (ev.telefono ? memoria.idPorTelefono(ev.telefono) : undefined);
    if (id) memoria.pausar(id, ahora + agente.horasPausaHumano * 3_600_000);
    return;
  }
  if (!memoria.marcarProcesado(ev.id, ahora)) return; // Meta reintenta: ya lo habíamos procesado
  if (memoria.estaPausado(ev.contacto, ahora)) return;

  await wa.marcarLeido(ev.id).catch(() => undefined);
  let texto: string | null;
  if (ev.tipo === "mensaje") {
    texto = await responder(agente, { contacto: ev.contacto, texto: ev.texto, telefono: ev.telefono, nombrePerfil: ev.nombrePerfil });
  } else {
    texto = ev.tipo === "audio" ? AUDIO_PENDIENTE : NO_SOPORTADO;
  }
  if (texto) await wa.enviarTexto(ev.contacto, texto);
}

export function crearServidor(agente: OpcionesAgente, wa: ClienteWhatsApp): http.Server {
  return http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/salud") {
      res.writeHead(200).end("ok");
      return;
    }
    if (url.pathname !== "/webhook") {
      res.writeHead(404).end();
      return;
    }
    if (req.method === "GET") {
      // Verificación inicial del webhook por parte de Meta.
      const ok = url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === config.whatsapp.verifyToken && !!config.whatsapp.verifyToken;
      res.writeHead(ok ? 200 : 403).end(ok ? (url.searchParams.get("hub.challenge") ?? "") : "");
      return;
    }
    if (req.method !== "POST") {
      res.writeHead(405).end();
      return;
    }
    const partes: Buffer[] = [];
    req.on("data", (c: Buffer) => partes.push(c));
    req.on("end", () => {
      const cuerpo = Buffer.concat(partes);
      if (!verificarFirma(cuerpo, req.headers["x-hub-signature-256"] as string | undefined, config.whatsapp.appSecret)) {
        res.writeHead(401).end();
        return;
      }
      res.writeHead(200).end(); // Meta necesita la confirmación enseguida; el trabajo se hace después.
      let eventos: Evento[] = [];
      try {
        eventos = interpretarWebhook(JSON.parse(cuerpo.toString("utf8")));
      } catch {
        return;
      }
      for (const ev of eventos) enCola(ev.contacto ?? ev.telefono ?? "eco", () => procesarEvento(agente, wa, ev));
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const faltan = Object.entries(config.whatsapp).filter(([, v]) => !v).map(([k]) => k);
  if (faltan.length) {
    console.error(`Falta configuración de WhatsApp: ${faltan.join(", ")}. Ver .env.example.`);
    process.exit(1);
  }
  const agente = montarAgente("agente.db");
  setInterval(() => agente.memoria.purgar(Date.now(), config.diasConservacion), 86_400_000).unref();
  crearServidor(agente, clienteWhatsApp(config.whatsapp)).listen(config.puerto, config.host, () =>
    console.log(`Agente escuchando en el puerto ${config.puerto}`),
  );
}
