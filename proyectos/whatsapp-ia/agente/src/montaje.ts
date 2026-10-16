import path from "node:path";
import { crearAvisador } from "./avisos.ts";
import { clienteClaude, type CrearMensaje, type OpcionesAgente } from "./agente.ts";
import { cargarCalendario } from "./calendario.ts";
import { cargarOferta } from "./conocimiento.ts";
import { config } from "./config.ts";
import { Memoria } from "./memoria.ts";
import { instrucciones } from "./prompt.ts";

/** Monta el agente con la configuración y la base de conocimiento del centro. */
export function montarAgente(nombreBd: string, crear: CrearMensaje = clienteClaude()): OpcionesAgente {
  const memoria = new Memoria(path.join(config.dirDatos, nombreBd));
  const calendario = cargarCalendario(config.dirConocimiento);
  return {
    crear,
    memoria,
    calendario,
    instrucciones: instrucciones(cargarOferta(config.dirConocimiento), config.urlPrivacidad, calendario),
    modelo: config.modelo,
    esfuerzo: config.esfuerzo,
    maxTokens: config.maxTokens,
    urlPrivacidad: config.urlPrivacidad,
    horasSesion: config.horasSesion,
    horasPausaHumano: config.horasPausaHumano,
    ibanActic: config.ibanActic,
    responsableActic: config.responsableActic,
    avisarEquipo: crearAvisador({ dirDatos: config.dirDatos, teamsWebhookUrl: config.teamsWebhookUrl }),
  };
}
