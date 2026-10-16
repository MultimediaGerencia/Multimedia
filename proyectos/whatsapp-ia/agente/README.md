# Agente de WhatsApp · prototipo

Agente de IA para el WhatsApp de empresa (601 989 689), hecho con Claude Code. Sigue la arquitectura del [documento 03](../03-propuesta-y-hoja-de-ruta.md).

## Qué hace ya

- **Responde** en catalán, castellano u otros idiomas, con la oferta 2026-2027 y los datos reales del centro ([conocimiento/](../conocimiento/)).
- **Avisa de que es una IA** en la primera respuesta a cada contacto, con el enlace a la privacidad.
- **Sabe si el centro está abierto**, con el horario, la jornada intensiva y los cierres de 2026 y 2027. Las fechas las calcula el código, no la IA.
- **Registra a los interesados** (nombre, curso, situación laboral, idioma y si acepta avisos) y avisa al equipo.
- **Pasa la conversación a una persona** cuando hace falta y deja de responder a ese contacto.
- **Se aparta** cuando alguien del equipo contesta desde la app del móvil (coexistencia).
- **Cobro de los cursos ACTIC**: da el importe, el IBAN y el concepto exacto de la transferencia (`AON2/2026/10`…), calculado por el programa, y avisa a la responsable para que dé el acceso.
- **Registra las bajas** de avisos.
- **Seguridad con Meta**: comprueba la firma de cada aviso, descarta duplicados e identifica a cada persona por su BSUID.
- **Errores**: si falla o el modelo rechaza la petición, responde con un mensaje seguro y avisa al equipo.
- **Avisos al equipo por Teams**: interesados nuevos, derivaciones (las urgentes, en rojo) y errores, en un canal de Teams. También quedan en `datos/avisos-equipo.log`.

## Pendiente

- **Notas de voz**: de momento pide que se lo escriban. Siguiente paso: Whisper turbo en el servidor.
- **Precios y condiciones de los cursos ACTIC**: el agente recoge el interés y deriva a una persona.
- **Citas en el calendario, recordatorios y preinscripción**: fase 2.

## Cómo probarlo (simulador)

Hace falta Node.js 22.18 o superior y una clave de la API de Claude de la empresa.

```bash
cd proyectos/whatsapp-ia/agente
npm install
export ANTHROPIC_API_KEY=...      # clave de la cuenta de la empresa
npm run simulador
```

Se escribe como si fuera un usuario de WhatsApp. Comandos: `/persona` simula que el equipo contesta desde el móvil, `/liberar`, `/nuevo` para un contacto nuevo e `/interesados` para ver los registrados.

## Pruebas automáticas

```bash
npm test          # 23 pruebas, sin coste: el modelo se simula
npm run typecheck
```

## Estructura

| Archivo | Qué hace |
|---|---|
| `src/prompt.ts` | Instrucciones del agente: tono, límites, derivación, programas y oferta |
| `src/agente.ts` | Bucle con Claude: memoria, herramientas y gestión de errores |
| `src/avisos.ts` | Avisos al canal de Teams |
| `src/herramientas.ts` | Registrar interesado, derivar a persona y registrar baja |
| `src/calendario.ts` | Horario, jornada intensiva y cierres (lee `conocimiento/calendario.json`) |
| `src/conocimiento.ts` | Carga la oferta (`conocimiento/oferta-2026-27.csv`) |
| `src/memoria.ts` | Base de datos local: contactos, conversaciones, interesados y derivaciones |
| `src/whatsapp.ts` | Firma de Meta, interpretación de avisos y envío de mensajes |
| `src/servidor.ts` | Servidor del webhook para producción |
| `src/simulador.ts` | Simulador en el terminal |

## Datos personales

Las conversaciones, los interesados y los avisos se guardan en `datos/`, que **no se sube al repositorio**. Las claves van en `.env` (plantilla en `.env.example`), que tampoco se sube. Las conversaciones se borran pasados 180 días (plazo a validar con el DPD).

## Actualizar la información

- **Oferta**: `conocimiento/oferta-2026-27.csv`. Cuando exista la hoja compartida, el agente la leerá de allí.
- **Calendario**: `conocimiento/calendario.json`.
- **Normas y tono**: `src/prompt.ts`. Se cambian con Claude Code y hay que pasar `npm test` antes de publicar.
