import fs from "node:fs";
import path from "node:path";
import { clienteClaude, type CrearMensaje, type OpcionesAgente } from "./agente.ts";
import { cargarCalendario } from "./calendario.ts";
import { cargarOferta } from "./conocimiento.ts";
import { config } from "./config.ts";
import { Memoria } from "./memoria.ts";
import { instrucciones } from "./prompt.ts";

/** Monta el agente con la configuración y la base de conocimiento del centro. */
export function montarAgente(nombreBd: string, crear: CrearMensaje = clienteClaude()): OpcionesAgente {
  const memoria = new Memoria(path.join(config.dirDatos, nombreBd));
  const rutaAvisos = path.join(config.dirDatos, "avisos-equipo.log");
  return {
    crear,
    memoria,
    calendario: cargarCalendario(config.dirConocimiento),
    instrucciones: instrucciones(cargarOferta(config.dirConocimiento), config.urlPrivacidad),
    modelo: config.modelo,
    esfuerzo: config.esfuerzo,
    maxTokens: config.maxTokens,
    urlPrivacidad: config.urlPrivacidad,
    horasSesion: config.horasSesion,
    horasPausaHumano: config.horasPausaHumano,
    // De momento los avisos al equipo se apuntan en un archivo. Más adelante: correo o Teams.
    avisarEquipo: (texto) => {
      fs.mkdirSync(config.dirDatos, { recursive: true });
      fs.appendFileSync(rutaAvisos, `${new Date().toISOString()} ${texto}\n`);
      console.log(`[aviso al equipo] ${texto}`);
    },
  };
}
