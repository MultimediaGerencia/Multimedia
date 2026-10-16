# 04 · Brief del agente (borrador para validar)

Es el **paso 1 del vídeo** aplicado a Multimèdia: lo que se le explica a Claude Code antes de escribir una sola línea de código. Lo deben revisar gerencia y coordinación académica.

Marcas: **[CONFIRMAR]** = dato que debe confirmar el centro · **[FUENTE]** = dato público verificado con su fuente.

## 1. El negocio

- **Multimèdia Tarragona**: centro de formación reglada y ocupacional, en activo desde 1996. La web dice «20 anys d'experiència» y conviene actualizarla a 30.
- **Sedes** (confirmado por gerencia):
  - **Torredembarra**, sede principal: Pg. de l'Estació 10, baixos, 43830 **[CONFIRMAR dirección]**. Todos los cursos se hacen aquí salvo que se diga lo contrario, y aquí está la secretaría.
  - **Tarragona** (C/ Joana Jugan 2, local 12, 43002): aula pequeña solo para formación concertada (EAPC y cursos privados pactados). No hay secretaría ni atención habitual. El agente **no** debe enviar a nadie allí ni dar citas en Tarragona.
- **Contacto público**: 977 22 22 31 · 601 989 689 · info@multimediatarragona.com (según el dosier de empresa). El **601 989 689** es el número de WhatsApp de empresa (confirmado por gerencia).
- **Imagen de marca** (dosier): lema «Training people» y «Formació professional adaptada a les teves necessitats»; certificaciones ISO 9001:2015 e ISO 14001:2015; presencia en Instagram, X y Facebook.
- **Horario de atención**: lunes a jueves de 9:00 a 13:00 y de 15:00 a 19:00; viernes de 9:00 a 15:00 (intensivo). Fines de semana cerrado. **[CONFIRMAR]** festivos y horario de verano.
- **Número de WhatsApp de empresa**: 601 989 689, en la app WhatsApp Business del móvil de la oficina, con ordenadores vinculados. **[CONFIRMAR]** si los ordenadores usan WhatsApp Web o la app de Windows.

### Oferta formativa

Según la web pública. Muchas páginas parecen desfasadas, así que **toda la oferta vigente 2026-2027 está por confirmar**:

| Línea | Qué dice la web | A confirmar |
|---|---|---|
| FOAP (SOC, personas desempleadas) | 2 cursos de Administración y gestión | Cursos, fechas y plazas vigentes |
| ADA (mujeres) | 11 cursos presenciales de 2 semanas | Cita una orden de 2018: ¿sigue vigente? |
| FPOAN (digital intensivo) | Java Back End, Android… | ¿Se imparte en 2026-2027? |
| Personas ocupadas (Consorci / Conforcat) | Cursos online REACT | REACT-UE está cerrado: ¿qué hay ahora? |
| ACTIC | Preparación nivel medio y avanzado | Fechas |
| EAPC | Ofimática para personal de la Generalitat | Es formación para un cliente; el agente no la promociona al público |
| Empresas | Formación a medida, bonificable | Se deriva a gerencia |
| Certificados de profesionalidad | ADGG0408 no aparece en la web | Qué especialidades tiene acreditadas el centro |
| Otros | Clases individuales, refuerzo escolar, alquiler de aulas, iniciación a la informática | Precios y horarios |

## 2. Quién escribe y qué hace el agente

| Perfil | Qué suele querer | Qué hace el agente |
|---|---|---|
| Persona desempleada | Requisitos, fechas, si es gratis, cómo inscribirse | Informa con la ficha del curso, explica los requisitos generales sin decidir, registra el interés y ofrece cita o preinscripción |
| Persona ocupada | Formación compatible con el trabajo, online | Lo mismo |
| Alumnado en curso | Horario, aula, documentación, certificado | Responde lo general; lo personal va a coordinación |
| Empresa | Formación bonificada (FUNDAE), a medida | Pregunta sector, plantilla y necesidad, y lo pasa a gerencia |
| Docente o candidato | Enviar CV, colaborar | Indica el canal (correo o web); no recoge CV por WhatsApp |
| Familia de un menor (refuerzo escolar) | Horarios, precios | Informa con los datos mínimos y lo pasa a una persona |
| Otros (proveedores, publicidad) | — | Respuesta breve o derivación |

## 3. Qué tiene que conseguir

1. Responder al momento, 24 h, en catalán o castellano, y en el idioma de quien escribe cuando sea otro.
2. Dar información correcta de la oferta vigente y de los requisitos generales, citando la norma cuando proceda.
3. Convertir consultas en **interesados registrados**, con curso de interés y consentimiento.
4. Dar **citas informativas** y enviar la **preinscripción** sin intervención humana.
5. Pasar a una persona cuando haga falta, con un resumen para que no tenga que volver a preguntar.
6. Avisar al alumnado (recordatorios y cambios) en una segunda fase.

## 4. Acciones (herramientas del agente)

| Herramienta | Qué hace | Fase |
|---|---|---|
| `consultar_oferta` | Busca en la hoja de oferta vigente por curso, área o colectivo | 1 |
| `registrar_interesado` | Guarda nombre, curso de interés, situación laboral, idioma y consentimientos | 1 |
| `derivar_a_persona` | Avisa al equipo con un resumen y pausa el bot en esa conversación | 1 |
| `ver_huecos` / `reservar_cita` / `cambiar_cita` / `anular_cita` | Gestiona citas informativas en el calendario del centro | 2 |
| `enviar_preinscripcion` | Envía el enlace o el formulario dentro de WhatsApp (Flow) | 2 |
| `registrar_baja` | Anota que la persona no quiere recibir más avisos | 2 |

## 5. Límites: lo que el agente no hace

- **No decide** admisiones, no evalúa, no asigna plazas y no garantiza subvenciones ni ayudas. Además de ser lo correcto, así el sistema queda fuera de los usos de alto riesgo del Reglamento europeo de IA (anexo III, punto 3).
- **No inventa** fechas, plazas ni precios. Si no está en la fuente, lo dice y ofrece una persona.
- **No pide ni guarda datos de salud, discapacidad** u otras categorías especiales. Si alguien los menciona, no los registra y ofrece hablar con una persona.
- **No recibe documentos de identidad** por WhatsApp: indica el canal seguro.
- **No da información de otra persona**, tampoco a familiares.
- **No envía publicidad** sin consentimiento previo.
- **No se hace pasar por una persona**: se presenta como asistente virtual con IA.
- **No habla de temas ajenos** al centro.

## 6. Tono

- Cercano, profesional y directo. Mensajes cortos pensados para el móvil, **un solo mensaje por respuesta** (cada mensaje cuesta dinero a partir de 1.000 al mes).
- Responde en el idioma de quien escribe.
- Primer mensaje, por ejemplo: «Hola! Sóc l'assistent virtual de Multimèdia Tarragona. Soc una IA i et puc informar dels cursos, de com inscriure't i donar-te cita. Si prefereixes parlar amb una persona, escriu PERSONA. Informació sobre privacitat: [enllaç]».

## 7. Cuándo pasa a una persona

- Lo pide el usuario.
- Quejas, conflictos, pagos o devoluciones.
- Situaciones personales complejas o datos sensibles.
- Empresas y docentes (gerencia y coordinación).
- Dos intentos fallidos de entender lo que se pide.
- Fuera de horario, avisa de cuándo le contestará una persona.
- **Si alguien del equipo responde desde la app del móvil**, el bot se calla en esa conversación hasta que se libere (manualmente o tras un tiempo sin intervención humana).

## 8. Fuentes de conocimiento

1. **Hoja «Oferta vigente»**, mantenida por coordinación: curso, código, programa, colectivo, requisitos, fechas, horario, sede, modalidad, plazas, estado y enlace.
2. **Preguntas frecuentes generales**, revisadas y con referencia normativa (BOE o DOGC).
3. **Datos del centro**: horarios, sedes, contacto, festivos locales.
4. **Textos legales**: privacidad y aviso de IA.

### Semilla de preguntas frecuentes

Verificada con fuentes públicas el 15/10/2026. **Coordinación debe validarla antes de usarla.**

| Tema | Respuesta base | Fuente |
|---|---|---|
| FOAP: quién puede ir | Al menos el 70 % del grupo deben ser personas desempleadas inscritas; hasta un 30 % pueden estar ocupadas. Todas deben estar inscritas en el SOC el día antes del inicio | SOC, programa FOAP ([web](https://serveiocupacio.gencat.cat/ca/soc/ambits-actuacio/formacio-professional/programes-de-formacio-professional-del-soc/formacio-doferta-en-arees-prioritaries-foap/index.html)) |
| FOAP: colectivos prioritarios | Mujeres, personas sin prestación, baja cualificación, menores de 30, personas en ERTO, quien completa un certificado; la convocatoria 2025 añade discapacidad ≥33 %, mayores de 45 y paro de larga duración | Resolució EMT/3091/2025 (FOAP 2025, ejecución ampliada hasta el 31/03/2027 por la EMT/2211/2026) |
| FOAP: aprobar | Asistir al menos al 75 % de cada módulo | Guía FOAP del SOC |
| Acceso a certificados | Nivel 1 sin requisitos académicos; nivel 2 con ESO o equivalente (u otras vías); nivel 3 con Bachillerato, título de Técnico o equivalente (u otras vías). Sin requisitos, prueba de acceso; en Catalunya sirven las pruebas de competencias clave | RD 659/2023, arts. 75-76 ([BOE-A-2023-16889](https://www.boe.es/buscar/act.php?id=BOE-A-2023-16889)) |
| Nuevo sistema de FP | Grado A (acreditación parcial), Grado B (certificado de competencia), Grado C (certificado profesional), acumulables | LO 3/2022 ([BOE-A-2022-5139](https://www.boe.es/buscar/doc.php?id=BOE-A-2022-5139)) |
| ADGG0408 | Certificado de nivel 1, 430 h según la ficha del SOC | [Ficha SOC](https://serveiocupacio.gencat.cat/web/.content/20_millorar-el-perfil/programes-formatius/ca/ADGG0408_cat.pdf) |
| Inscripción en el SOC | La web del centro remite al 900 800 046 (L-V, 8-14 h) | Web del centro **[CONFIRMAR vigencia]** |
| FUNDAE (empresas) | La empresa forma y lo recupera bonificando cotizaciones con su crédito anual; hay que comunicar el inicio al menos 2 días naturales antes | [FUNDAE](https://www.fundae.es/formacion/financiacion) · RD 694/2017 modificado por el RD 1189/2025 |

Pendiente de verificar: gratuidad y ayudas (transporte, conciliación), documentación habitual, prácticas no laborales y su exención, y quién expide hoy el certificado en Catalunya.

## 9. Cómo sabremos si funciona

- Porcentaje de consultas resueltas sin intervención humana.
- Tiempo hasta la primera respuesta.
- Interesados registrados y citas reservadas por semana.
- Derivaciones a persona y su motivo.
- Errores detectados en la revisión semanal de conversaciones.
- Valoración de los usuarios.

## 10. Lo que necesitamos del centro

- [x] Número de WhatsApp: 601 989 689.
- [x] Está en WhatsApp Business, en el móvil de la oficina, con ordenadores vinculados.
- [ ] Quién lo atiende hoy y si los ordenadores usan WhatsApp Web o la app de Windows.
- [ ] Volumen aproximado de conversaciones al mes y franjas de más trabajo.
- [x] Horario de atención.
- [ ] Calendario de festivos y horario de verano, si lo hay.
- [x] Oferta 2026-2027 (hoja provisional, ver conocimiento/). Faltan fechas, horarios y sedes.
- [ ] Tipos de cita (informativa, prueba de nivel, matrícula), duración y quién las atiende.
- [ ] Calendario que se usa (Google o Microsoft).
- [ ] Dónde se registran hoy los interesados (hoja, CRM, papel).
- [ ] Persona responsable de mantener la oferta y de revisar conversaciones.
- [ ] Política de privacidad actual (para adaptarla al canal).
