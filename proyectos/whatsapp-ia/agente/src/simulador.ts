import readline from "node:readline";
import { responder } from "./agente.ts";
import { montarAgente } from "./montaje.ts";

// Simulador de WhatsApp en el terminal: habla con el agente real sin conectar nada a Meta.
const agente = montarAgente("simulador.db");
let contacto = `simulador-${Date.now()}`;

console.log(`Simulador del agente de WhatsApp de Multimèdia Tarragona
Escribe como si fueras un usuario. Comandos:
  /persona   simula que alguien del equipo responde desde el móvil (el agente se aparta)
  /liberar   el agente vuelve a responder
  /nuevo     empieza como un contacto nuevo
  /interesados  muestra los interesados registrados
  /salir
`);

if (!process.env.CLAVE_CLAUDE && !process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
  console.log("Aviso: no hay clave de la API de Claude (CLAVE_CLAUDE o ANTHROPIC_API_KEY). Sin ella el agente responderá con el mensaje de error.\n");
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "Tú > " });
rl.prompt();
for await (const entrada of rl) {
  const linea = entrada.trim();
  if (!linea) { rl.prompt(); continue; }
  if (linea === "/salir") break;
  if (linea === "/nuevo") { contacto = `simulador-${Date.now()}`; console.log("(contacto nuevo)\n"); rl.prompt(); continue; }
  if (linea === "/persona") { agente.memoria.pausar(contacto, Date.now() + agente.horasPausaHumano * 3_600_000); console.log("(el equipo ha tomado la conversación)\n"); rl.prompt(); continue; }
  if (linea === "/liberar") { agente.memoria.pausar(contacto, 0); console.log("(el agente vuelve a responder)\n"); rl.prompt(); continue; }
  if (linea === "/interesados") { console.table(agente.memoria.interesados()); rl.prompt(); continue; }
  const inicio = Date.now();
  const texto = await responder(agente, { contacto, texto: linea });
  const segundos = ((Date.now() - inicio) / 1000).toFixed(1);
  console.log(texto === null ? "(el agente no responde: una persona lleva la conversación)\n" : `Agente (${segundos} s) > ${texto}\n`);
  rl.prompt();
}
rl.close();
