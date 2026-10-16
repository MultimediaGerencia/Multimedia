# 02 · Estudio de posibilidades

Automatización del WhatsApp de empresa de Multimèdia Tarragona · 15/10/2026

> **Cómo leer las cifras.** Precios y normas se han comprobado el 15/10/2026 con documentación oficial cuando se pudo, y si no con fuentes secundarias fechadas. El entorno de trabajo no permitía abrir directamente las webs de Meta, el BOE o la AEPD, así que lo marcado **[confirmar]** debe comprobarse en la fuente oficial antes de contratar o publicar nada.

## Resumen para leer en dos minutos

1. **Se puede automatizar casi todo el WhatsApp del centro**, de forma legal y con un coste mensual moderado: informar 24 horas en catalán y castellano, registrar interesados, dar citas, enviar preinscripciones, recordar clases, hacer encuestas y avisar al equipo.
2. **Solo por la vía oficial** de Meta (WhatsApp Business Platform). Las herramientas «no oficiales» que conectan el móvil por QR ponen en riesgo el número del centro: descartadas.
3. **El equipo puede seguir usando la app del móvil.** Desde 2025, la **coexistencia** permite usar a la vez la app WhatsApp Business y la automatización con el mismo número. Cuando alguien del equipo contesta desde el móvil, el agente se aparta.
4. **2026 ha cambiado las reglas:**
   - Desde el 1/10/2026 Meta cobra las respuestas a partir de 1.000 al mes por número.
   - El marketing ha subido a unos 0,0585 € por mensaje en España.
   - Desde el 2/8/2026 es obligatorio avisar de que se habla con una IA.
   - Meta permite los agentes de IA de atención propios de cada empresa.
5. **Recomendación:** empezar ya con lo gratuito (configurar bien la app, la cuenta de Meta y la base de conocimiento) y construir un **agente a medida con Claude Code**, conectado a través de un proveedor oficial con coexistencia. **Plan B:** una plataforma de pago tipo Superchat si no queremos mantener nada técnico.
6. **Coste orientativo:** de 60 a 170 € al mes en volúmenes bajo y medio, según el modelo de IA (apartado 8).
7. **Riesgos principales:** que invente información, datos sensibles, dependencia técnica y cambios de Meta. Todos tienen medidas de control (apartado 7).

---

## 1. Punto de partida

- WhatsApp es el canal habitual de los futuros alumnos (muchos, personas desempleadas) para preguntar por cursos.
- Las preguntas se repiten: requisitos, fechas, si es gratis, cómo inscribirse, horarios, dónde estamos.
- Fuera de horario no hay respuesta y los interesados se enfrían.
- El equipo es de 4 personas y la atención compite con el resto del trabajo.
- La web está solo en catalán, no tiene botón de WhatsApp y parte del contenido está desfasado. El agente no puede usarla como fuente tal cual.

Por confirmar: qué número se usa, en qué móvil, cuántas conversaciones hay al mes y quién las atiende (ver [04-brief-del-agente.md](04-brief-del-agente.md), apartado 10).

## 2. Cómo funciona WhatsApp para empresas en 2026

### 2.1 Tres formas de usarlo

| | App WhatsApp Business | WhatsApp Business Platform (Cloud API) | Coexistencia |
|---|---|---|---|
| Qué es | La app gratuita del móvil | La vía oficial para conectar software (bots, CRM, avisos) | Las dos a la vez con el mismo número |
| Automatización | Mensajes de bienvenida y ausencia, respuestas rápidas, etiquetas, catálogo | Total | Total, y el equipo sigue en el móvil |
| Coste | Gratis | Por mensaje enviado (2.3) | Lo enviado desde la app sigue siendo gratis |
| Alta | Inmediata | Cartera de empresa en Meta, número y nombre visible | Solo a través de un proveedor oficial (BSP o Tech Provider) mediante su alta guiada |

### 2.2 Las reglas del juego

- **Ventana de 24 horas.** Cuando una persona escribe, se le puede responder libremente durante 24 horas. Pasado ese plazo, solo con **plantillas** aprobadas por Meta.
- **Plantillas.** Tres categorías:
  - **Utilidad:** recordatorio de cita, cambio de aula, confirmación de matrícula.
  - **Marketing:** convocatorias, promociones.
  - **Autenticación:** códigos de verificación.

  Meta las revisa (de minutos a 24 h) y admite el **catalán** (`ca`). Una sola frase promocional convierte una plantilla de utilidad en marketing, y Meta sanciona el abuso de forma escalonada.
- **Consentimiento previo** para cualquier mensaje que inicie el centro, con una forma fácil de darse de baja.
- **Calidad.** Si la gente bloquea o denuncia, Meta pausa plantillas y puede limitar el número.
- **Límites.** Sin verificar la empresa, se puede iniciar conversación con 250 personas distintas cada 24 h. Con la verificación sube mucho (Meta está pasando directamente a 100.000 **[confirmar]**). Para nuestro volumen, 250 basta para empezar, pero conviene verificar la empresa (también lo exigen los formularios integrados, *Flows*).
- **Rendimiento.** No conviene trocear una respuesta en varios mensajes: hay un límite por destinatario y, además, cada mensaje cuesta.

### 2.3 Precios para España

Tarifas por mensaje sin IVA. Las cifras vienen de la documentación de Meta citada por proveedores, de fuentes secundarias y de Twilio **[confirmar en WhatsApp Manager]**.

| Concepto | Precio | Desde |
|---|---|---|
| Mensajes que **recibimos** | Gratis | Siempre |
| **Respuestas** dentro de la ventana de 24 h (mensajes de servicio) | **1.000 gratis al mes por número**; después, unos 0,0166 € cada una | 1/10/2026 |
| Plantillas de **utilidad** (recordatorios, avisos) | Unos 0,0166 €, también dentro de la ventana | 1/10/2026 |
| Plantillas de **marketing** | Unos **0,0585 €** (antes 0,0509 €) | 1/7/2026 |
| Conversaciones que empiezan desde un anuncio *Click to WhatsApp* o el botón de Facebook | **Gratis 72 h**, plantillas incluidas | Sigue vigente |
| Mensajes enviados **desde la app** en coexistencia | Gratis | — |

Si a 30/9/2026 no había un **método de pago** en la cuenta, Meta deja de entregar las respuestas cuando se agotan las 1.000 gratuitas. Fuentes: [precios de Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing), [mensajes de servicio](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages), [aviso de Twilio](https://help.twilio.com/articles/53100480177819).

### 2.4 Coexistencia: seguir con la app del móvil

- **Disponibilidad.** Ya está disponible en la UE y en España (llegó a finales de 2025).
- **Requisitos:**
  - App WhatsApp Business 2.24.17 o superior.
  - Número con unos 7 días de uso en la app **[confirmar]**.
  - Alta a través de un proveedor oficial con alta guiada (*Embedded Signup*).
- **Qué se sincroniza:** hasta 6 meses de chats individuales y los contactos. Los grupos no.
- **Qué cambia en la app:**
  - Las listas de difusión pasan a solo lectura.
  - Se desactivan los mensajes temporales, «ver una vez» y la ubicación en tiempo real.
  - Se desvinculan los dispositivos complementarios; después se pueden volver a vincular los compatibles (WhatsApp para Windows no).
  - Hay que abrir la app al menos cada 13 días.
  - Los grupos y las llamadas siguen en la app.
- **Clave para nosotros:** lo que el equipo envía desde el móvil llega al agente como «eco» (`smb_message_echoes`). Así el agente sabe que una persona ha tomado la conversación y se calla.

Fuente: [Meta, alta de usuarios de la app](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/).

### 2.5 Novedades de 2026 que nos afectan

- **Nombres de usuario e identificador por empresa (BSUID).**
  - Desde abril de 2026 cada aviso de Meta trae un identificador del usuario propio de nuestra empresa (`user_id`). El teléfono puede no llegar si la persona usa nombre de usuario y no ha hablado con nosotros recientemente.
  - El sistema debe identificar a las personas por ese identificador y pedir el teléfono solo cuando haga falta. Meta lo exige también a las integraciones directas.
  - Fuente: [BSUID](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-scoped-user-ids/).
- **Política de Meta sobre IA.**
  - Desde el 15/1/2026 Meta prohíbe los asistentes de IA **de propósito general** (tipo ChatGPT) en su plataforma.
  - Los **agentes de atención propios de una empresa están permitidos**, siempre que no se usen los datos de WhatsApp para entrenar modelos.
  - En el EEE, además, la Comisión Europea impuso medidas cautelares el 9/6/2026 que suspenden esa prohibición. Meta las ha recurrido.
  - Fuentes: [TechCrunch](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/), [condiciones de Meta](https://www.whatsapp.com/legal/business-solution-terms).
- **Meta Business Agent**, la IA de la propia Meta.
  - Se lanzó en junio de 2026 para la app y la API: responde, recoge interesados, da citas y pasa a una persona.
  - En la app se activa por mercados y con lista de espera. **No está confirmado en España ni en catalán.**
  - Por API cuesta 2 $ por millón de tokens, unos 0,04-0,05 $ por mensaje según Meta.
  - Solo usa la información del perfil y del catálogo, no se integra con nuestros sistemas y tiene sus propias condiciones de datos.
  - Vale la pena mirar si aparece en la app, pero no sustituye a un agente propio.
- **WhatsApp Flows.**
  - Son formularios de varias pantallas dentro del chat. Sirven para la preinscripción, una cita o una encuesta.
  - Funcionan con la API directa y requieren verificar la empresa.
- **Llamadas por WhatsApp (Calling API).** Existen, pero no aportan al inicio del proyecto.

## 3. Catálogo de posibilidades

Lo que se puede automatizar, de más a menos prioritario para Multimèdia. La fase corresponde a la hoja de ruta del documento 03.

### A. Atención y captación

| # | Posibilidad | Qué hace | Valor | Fase |
|---|---|---|---|---|
| 1 | Respuesta inmediata 24 h | Responde al momento las preguntas frecuentes, en catalán, castellano u otros idiomas | Muy alto | 1 |
| 2 | Información de cursos con datos vivos | Consulta la hoja de oferta vigente: requisitos, fechas, horario, sede, modalidad, plazas | Muy alto | 1 |
| 3 | Registro de interesados | Guarda nombre, curso de interés, situación laboral e idioma, con consentimiento, y avisa a información y prospección | Muy alto | 1 |
| 4 | Pasar a una persona | Detecta cuándo hace falta, avisa al equipo con un resumen y se aparta | Imprescindible | 1 |
| 5 | Notas de voz | Transcribe los audios (Whisper) y responde como si fueran texto | Alto | 1 |
| 6 | Fuera de horario | Atiende igual y avisa de cuándo contestará una persona | Alto | 1 |
| 7 | Citas | Entrevista informativa, prueba de nivel o matrícula presencial en el calendario del centro, con confirmación | Alto | 2 |
| 8 | Preinscripción guiada | Envía un formulario dentro de WhatsApp (*Flow*) o un enlace seguro | Alto | 2 |
| 9 | Lista de espera de convocatorias | «Avísame cuando abra el curso X»: lo pide la persona, así que es un aviso solicitado | Alto | 2 |
| 10 | Botón de WhatsApp en la web y en Facebook | Enlace directo al chat con un mensaje inicial | Medio, coste cero | 0 |

### B. Alumnado en curso

| # | Posibilidad | Qué hace | Fase |
|---|---|---|---|
| 11 | Recordatorios | Inicio de curso, clases, exámenes o pruebas de competencias clave (plantillas de utilidad) | 2 |
| 12 | Avisos de última hora | Cambio de aula, horario o docente; anulación | 2 |
| 13 | Documentación pendiente | Avisa de lo que falta, sin recibir documentos de identidad por WhatsApp | 3 |
| 14 | Encuestas de satisfacción | Al acabar el módulo o el curso; resultados agregados para el sistema de calidad | 3 |
| 15 | Certificado o diploma listo | Aviso para recogerlo y explicación del trámite | 3 |

### C. Difusión (solo con consentimiento previo)

| # | Posibilidad | Qué hace | Fase |
|---|---|---|---|
| 16 | Nuevas convocatorias segmentadas | Por área de interés y colectivo, a quien lo haya aceptado expresamente | 3 |
| 17 | Anuncios *Click to WhatsApp* | Anuncios en Facebook o Instagram que abren el chat; 72 h de mensajes gratis | 3 |
| 18 | Canal de WhatsApp | Novedades unidireccionales, gratis, para quien se suscriba | 3 |
| 19 | Reactivar interesados | Recordatorio a quien preguntó por un curso que ahora abre (si consintió) | 3 |

### D. Uso interno

| # | Posibilidad | Qué hace | Fase |
|---|---|---|---|
| 20 | Resumen diario al equipo | Consultas del día, interesados nuevos, citas e incidencias, por correo o Teams | 1 |
| 21 | Alertas | Interesado prioritario, queja o pregunta sin respuesta | 1 |
| 22 | Cuadro de mando | Temas más preguntados, cursos más demandados, conversión de consulta a matrícula | 3 |
| 23 | Una sola base de conocimiento | La misma información alimenta el WhatsApp, la web y las respuestas por correo | 2 |

### E. Empresas y otros

| # | Posibilidad | Qué hace | Fase |
|---|---|---|---|
| 24 | Formación bonificada (FUNDAE) | Pregunta sector, plantilla y necesidad, y lo pasa a gerencia | 1 |
| 25 | Candidatos a docente | Indica el canal correcto; no recoge CV por WhatsApp | 1 |

**Fuera de alcance:** clientes institucionales (EAPC, ICIQ, Port de Tarragona). Cuando formamos a su personal solemos ser encargados del tratamiento de sus datos, así que su alumnado no entra en el agente sin su autorización por escrito.

## 4. Cuatro formas de construirlo

| | **A. Solo la app** | **B. Plataforma de pago (SaaS)** | **C. Low-code (n8n)** | **D. A medida con Claude Code** |
|---|---|---|---|---|
| Qué es | Configurar bien la app gratuita | Superchat, Respond.io, WATI, Kommo… con agente IA y bandeja compartida | Flujos visuales que unen WhatsApp, IA, hojas y calendario | Agente propio como el del vídeo, en un servidor de la UE |
| Automatización | Baja | Media-alta | Alta | Máxima |
| Control y ajuste (catalán, reglas del SOC, RGPD) | — | Limitado a lo que ofrezca la plataforma | Alto | Total |
| Puesta en marcha | Horas | Días | 20-40 h | 40-80 h con Claude Code |
| Mantenimiento técnico | Ninguno | Ninguno | Medio (servidor, actualizaciones) | Medio (servidor y código) |
| Coste mensual (volumen medio) | 0 € | ~165-200 €, Meta incluido | ~25-100 € + Meta | ~100-170 € (apartado 8) |
| Coexistencia con el móvil | — | Superchat la confirma; el resto, por confirmar | Con un proveedor que la ofrezca | Con un proveedor que la ofrezca |
| Riesgo principal | Se queda corto | Dependencia del proveedor y coste por usuario | Complejidad creciente de los flujos | Dependencia de quien lo mantenga |

### Plataformas de pago revisadas

Precios de entrada orientativos, octubre de 2026 **[confirmar en cada web]**:

| Plataforma | Entrada al mes | Agente de IA | Comentario |
|---|---|---|---|
| Superchat (Alemania) | 79-89 € (Basic); 129-149 € (Professional, 10 usuarios, 1 agente IA) | Sí, más de 50 idiomas | Coexistencia confirmada; firma contrato de encargado del tratamiento |
| Respond.io | 79-99 $ (Starter, sin IA); 159-199 $ (Growth) | Desde Growth | Sin recargo sobre Meta, según terceros |
| WATI | 59-69 $; la IA (Astra) exige Pro (149 $) + ~99 $ | Sí | Recargo sobre Meta, según terceros |
| Kommo | 25-35 $ por usuario (Advanced), con prepago de 6 meses | Sí, con créditos | Es un CRM en español |
| Callbell (España) | 14-18 € por agente (mínimo 3) + ~50 € de WhatsApp | Créditos de IA | Interfaz en español |
| Chatwoot | Gratis si se aloja uno mismo; 19-39 $ por agente en la nube | Propio o conectado | Código abierto; sirve como bandeja del equipo |
| 360dialog (Berlín) | 49 € por número | No: solo da acceso a la API | Sin recargo sobre Meta. Encaja con la opción D **[confirmar coexistencia]** |

Descartadas por precio o enfoque: Trengo (~299 €/mes), HubSpot (agente IA solo en Professional), Manychat (orientado a marketing) y Twilio (solo para desarrolladores).

### Lo que no hay que hacer: APIs no oficiales

Baileys, whatsapp-web.js, WAHA o Evolution API en modo QR imitan WhatsApp Web. Las normas de WhatsApp lo tratan como abuso, sus propios autores avisan de que pueden bloquear el número y no hay contrato con Meta, lo que también es un problema de RGPD. **No las usaremos nunca con el número del centro.**

## 5. El «cerebro»: modelo de IA

- **API directa de Anthropic (Claude)** en lugar de OpenRouter, como hace el vídeo: un intermediario menos y un contrato de encargado del tratamiento directo.
  - No entrena con nuestros datos y los borra en 30 días o menos.
  - Se puede pedir retención cero por acuerdo.
- **Residencia de datos.**
  - La API directa solo permite procesar en «global» o en EE. UU., con cláusulas contractuales tipo como garantía.
  - Si se exige procesar en la UE, Claude está en Google Vertex AI (región UE) y en Amazon Bedrock (regiones UE), con un recargo del 10 % en los puntos regionales.
- **Modelo por defecto: Claude Opus 5.5**, el más capaz de uso general.
  - En el piloto mediremos con el banco de pruebas si Sonnet 5.5 o Haiku 5.5 mantienen la calidad. Bajar de modelo para ahorrar es decisión nuestra, con datos.
- **La caché del modelo** abarata mucho la parte fija (instrucciones y base de conocimiento), que se reutiliza en cada mensaje.

| Modelo | Precio por millón de tokens (entrada / salida) | Coste estimado por conversación* |
|---|---|---|
| Claude Opus 5.5 | 4 $ / 20 $ | ~0,10 € |
| Claude Sonnet 5.5 | 2 $ / 10 $ | ~0,044 € |
| Claude Haiku 5.5 | 0,10 $ / 0,50 $ | ~0,002 € |

\* Supuestos conservadores: 4 respuestas y una consulta a herramientas por conversación, 8.000 tokens de instrucciones y conocimiento en caché, unos 950 tokens nuevos por llamada y 250 de respuesta. Precios oficiales: [platform.claude.com](https://platform.claude.com/docs/en/about-claude/pricing).

### Notas de voz

El modelo trabaja con texto e imágenes, así que los audios se transcriben antes. Lo hemos medido con el propio vídeo, en un servidor de 4 vCPU sin GPU:

- **Whisper turbo** tarda unos 10 s por cada 20 s de audio, con la misma calidad que el modelo grande en ese fragmento.
- **Whisper large-v3** tarda casi 2 minutos: inviable sin GPU.

**Propuesta:** Whisper turbo en el propio servidor. El audio no sale de nuestro servidor en la UE y no hay que contratar a otro proveedor. Detalle en [anexos/transcripcion-whisper.md](anexos/transcripcion-whisper.md).

## 6. Normativa: lo imprescindible

Resumen. Las referencias marcadas **[confirmar]** deben cotejarse con el texto oficial y con nuestro DPD o asesoría antes de publicar textos legales.

| Norma | Qué exige | Cómo lo cumplimos |
|---|---|---|
| **Reglamento de IA**, art. 50.1 (Reglamento (UE) 2024/1689) | Informar de que se habla con una IA, como tarde en la primera interacción. Aplicable desde el **2/8/2026**; según las fuentes consultadas, el «Ómnibus digital» (Reglamento (UE) 2026/1744) no lo aplazó **[confirmar]** | Primer mensaje: «Soy el asistente virtual (IA)…» |
| **Reglamento de IA**, anexo III.3 (alto riesgo en educación) | Es alto riesgo decidir el acceso o la admisión, evaluar, determinar el nivel o vigilar exámenes | El agente **solo informa y da citas**. Nunca dice «cumples o no cumples», no filtra, no puntúa ni prioriza, no asigna grupos ni hace pruebas de nivel |
| **Reglamento de IA**, art. 4 | Promover la alfabetización en IA del personal | Formación breve y documentada para el equipo (somos un centro de formación) |
| **RGPD**, arts. 6, 13 y 28 | Base jurídica, información por capas y contratos con los encargados | Consultas y citas: medidas precontractuales (6.1.b). Publicidad: consentimiento. Contratos con Meta (Data Processing Terms), el proveedor, Anthropic, el calendario y el CRM |
| **RGPD**, art. 35 | Evaluación de impacto si concurren 2 o más criterios de la lista de la AEPD | Se dan varios (tecnología innovadora y personas en situación vulnerable): **hay que hacer la EIPD** |
| **RGPD**, art. 9 | Las categorías especiales (salud, discapacidad…) tienen protección reforzada | El agente no las pide; si salen, no las guarda y deriva a una persona. Borrado o enmascarado automático en los registros |
| **RGPD**, art. 30 | Registro de actividades de tratamiento | Añadir: consultas con IA, interesados y citas, avisos y difusión |
| **Transferencias internacionales** | El Marco UE-EE. UU. (DPF) sigue vigente, aunque está recurrido ante el TJUE (C-703/25 P) y hay dudas nuevas en 2026 | Cláusulas contractuales tipo como respaldo, almacenamiento local de Meta en la UE y, si se quiere, Claude en región UE |
| **LSSI**, arts. 20-22 | Comunicaciones comerciales solo con consentimiento previo (o a clientes, sobre productos similares), identificadas y con baja fácil | Consentimiento separado y sin marcar, con prueba guardada; «BAJA» en cada plantilla |
| **Catalunya** (Codi de consum, art. 128-1; Llei 1/1998, art. 32) | Atender en la lengua oficial que elija la persona; información de la oferta, al menos en catalán | Agente bilingüe; plantillas y fichas de cursos, como mínimo en catalán |
| **Menores** (LOPDGDD, art. 7) | Por debajo de 14 años consienten los progenitores (está en tramitación subirlo a 16 **[confirmar]**) | A menores de 14 solo información general, sin registrar datos. Edad configurable |
| **Políticas de Meta** | Consentimiento previo para los mensajes que inicia la empresa, calidad, nada de entrenar con los datos | Incluido en el diseño |

Si impartimos enseñanzas regladas, es obligatorio tener delegado de protección de datos (LOPDGDD, art. 34.1.b) **[confirmar nuestra situación]**.

La lista de comprobación completa está en el documento 03.

## 7. Riesgos y cómo controlarlos

| Riesgo | Control |
|---|---|
| Inventa fechas, requisitos o ayudas | Solo responde con la hoja de oferta y las preguntas frecuentes validadas; si no lo sabe, deriva. Banco de pruebas antes de cada cambio y revisión semanal de conversaciones |
| Manipulación («ignora tus instrucciones…») | Instrucciones robustas, herramientas con permisos mínimos y casos de manipulación en las pruebas |
| Datos sensibles o de terceros | No los pide, no los guarda, no da datos de otra persona; enmascarado automático |
| El servidor se cae | Con coexistencia, los mensajes siguen llegando al móvil: no se pierde a nadie. Reinicio automático, alertas y copias diarias |
| Meta limita el número por mala calidad | Pocas plantillas, siempre con consentimiento y baja fácil; vigilancia de la calificación de calidad |
| El coste se dispara | Límite de gasto en Claude y en Meta, un mensaje por respuesta y aviso si se supera el presupuesto |
| Depende de una persona | Código documentado en este repositorio, mantenimiento con Claude Code y un responsable funcional no técnico para el conocimiento |
| Cambios de Meta (precios, normas) | Arquitectura sencilla y revisión trimestral |
| Respuestas inadecuadas que dañen la imagen | Tono definido, temas fuera de ámbito bloqueados y revisión de muestras |

## 8. Costes estimados por escenario

Opción D con proveedor de coexistencia (referencia: 360dialog, 49 €/mes), servidor de 4 vCPU en la UE y precios sin IVA. Cada conversación genera de media 4 respuestas.

| Escenario | Conversaciones/mes | Meta (respuestas + recordatorios) | Proveedor + servidor | Claude Opus 5.5 | Sonnet 5.5 | Haiku 5.5 | **Total/mes** |
|---|---|---|---|---|---|---|---|
| Bajo | 250 | ~2 € | ~59 € | ~25 € | ~11 € | ~1 € | **~62-86 €** |
| Medio | 750 | ~38 € | ~59 € | ~75 € | ~33 € | ~2 € | **~99-172 €** |
| Alto | 2.000 | ~129 € | ~64 € | ~200 € | ~88 € | ~5 € | **~198-393 €** |

Notas:

- La horquilla del total va de Haiku a Opus.
- Una campaña de marketing a 400 contactos cuesta unos 23 €.
- Sin coexistencia (conexión directa con Meta, sin proveedor) se ahorran los 49 €, pero el equipo tendría que atender desde otra bandeja.
- Para comparar, una plataforma de pago tipo Superchat Professional saldría por unos 165-200 €/mes en el escenario medio, Meta incluido.
- **Puesta en marcha:** de 40 a 80 horas de trabajo con Claude Code repartidas en 6-10 semanas. Además, unas horas del equipo para preparar la base de conocimiento y validar las pruebas.

## 9. Fuentes principales

- Meta:
  - [Precios](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
  - [Mensajes de servicio](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
  - [Coexistencia](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/)
  - [BSUID](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-scoped-user-ids/)
  - [Idiomas de plantillas](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/supported-languages/)
  - [Categorías de plantillas](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization)
  - [Condiciones](https://www.whatsapp.com/legal/business-solution-terms)
  - [Contrato de encargado](https://www.whatsapp.com/legal/business-data-processing-terms)
- Anthropic:
  - [Precios](https://platform.claude.com/docs/en/about-claude/pricing)
  - [Residencia de datos](https://platform.claude.com/docs/en/manage-claude/data-residency)
  - [DPA](https://www.anthropic.com/legal/data-processing-addendum)
- Normativa:
  - [Reglamento de IA](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
  - [RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
  - [LOPDGDD](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673)
  - [LSSI](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758)
  - [Lista EIPD de la AEPD](https://www.aepd.es/documento/listas-dpia-es-35-4.pdf)
- Política de IA de Meta y reacción europea:
  - [TechCrunch, 18/10/2025](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/)
  - [Medidas cautelares, 6/2026](https://euperspectives.eu/2026/06/commission-gives-meta-five-days-to-open-whatsapp-ai-to-competition/)
- Plataformas:
  - [Superchat, coexistencia](https://help.superchat.com/en/articles/515557-how-to-set-up-superchat-via-whatsapp-coexistence)
  - [360dialog](https://360dialog.com/whatsapp-api)
  - [n8n, precios](https://n8n.io/pricing/)
  - [Chatwoot](https://github.com/chatwoot/chatwoot)
