# Base de conocimiento del agente

## Oferta formativa 2026-2027

Fuente: hoja interna «FORMACIONS 26-27 PROVISIONAL» (actualizada el 02/10/2026), entregada por gerencia el 16/10/2026. De ella **solo se han extraído datos de los cursos**. El seguimiento de docentes (nombres, teléfonos y tarifas) son datos personales y no entran en el repositorio ni en el agente.

Archivo: [oferta-2026-27.csv](oferta-2026-27.csv) (30 cursos, separador «;»). Se excluyen las filas ocultas de la hoja (51-54, módulos de estética IMPE0110, no solicitados).

| Programa | Organismo | Colectivo | Estado | Cursos |
|---|---|---|---|---|
| PIMEC | Consorci per a la Formació Contínua (los cursos los concede a PIMEC; Multimèdia los imparte para PIMEC) | Persones treballadores (prioritari; també poden haver-hi persones aturades) | **Aprobado** | 16 |
| Certificado profesional ADGG0208 (nivel 2, grado C) | Consorci per a la Formació Contínua | Persones treballadores | Pendiente de resolución | ADGG0208 + PRL básico |
| Forma i Contracta | SOC | Persones aturades | Pendiente de resolución | ADGG0208 + PRL, derechos laborales, igualdad, ACTIC. Incluye prácticas en empresa y compromiso de inserción (ver abajo) |
| FOAP | SOC | Persones aturades | Pendiente de resolución (probablemente se apruebe una parte) | ADGD0308, ADGG0508, IFCD0110, SSCS0208 (2 grupos), ADGG0408, FCOV24 |

## Cómo debe usar el agente el campo `estado`

| Estado | Qué puede decir el agente | Qué no puede decir |
|---|---|---|
| `aprobado` | Que el curso está previsto y aprobado, y explicar el colectivo, el nivel y las horas. Ofrecer apuntarse a la lista de interesados y dar cita | Fechas, horario o sede mientras esas columnas estén vacías |
| `pendiente_resolucion` | Que es un curso **previsto, pendiente de la resolución del organismo**, y ofrecer apuntarse a la **lista de espera** para avisar cuando se confirme (aviso solicitado por la persona) | Que se hará seguro, fechas o plazas |

Esto sigue tu indicación: lo pendiente se puede publicitar hasta que haya resolución, siempre como «previsto».

## Incidencias detectadas en la hoja (para revisar)

1. **Faltan fechas concretas, horario y sede.** Confirmado por gerencia: todo es **presencial** y empieza a **principios de enero de 2027**. Mientras no haya fechas concretas, el agente dirá «inicio previsto a principios de enero».
2. **Enlaces de PIMEC.** La columna J («LINK PROGRAMA», oculta) apunta a fichas de otros cursos. Se ha usado la columna «PROGRAMA», que sí coincide con cada curso.
3. **Horas de los certificados FOAP.** La hoja indica ADGD0308 660 + 220, ADGG0508 352 + 88, IFCD0110 480 + 80 y SSCS0208 337 + 112,5. Hay que confirmar si la segunda cifra son prácticas y cuál es el total oficial.
4. **ADGG0408 y FCOV24 (FOAP), y las acciones de Forma i Contracta**, no tienen horas ni nivel en la hoja.
5. **El PRL básico (FCOS02) del bloque del Consorci** figura con organismo SOC.
6. **Erratas en los nombres**: «PUBLCACIÓ», «ADMINSITRATIUS», «SOCISANITÀRIA», «RELACIO». El agente usará los nombres oficiales.
7. **Código dudoso**: «CTRHI0015» probablemente es CTRH0015.

## Último curso de 2026

Según la captura del calendario de noviembre de 2026:

- **«Eines coaching 1»** (programa PIMEC): 6 sesiones, los días 11, 13, 16, 18, 20 y 23 de noviembre de 2026, en Torredembarra. Es el último curso que empieza este año.
- Horario: de 15:00 a 20:00. **15 plazas disponibles.** El agente puede anunciarlo y apuntar interesados.

## Forma i Contracta: cómo explicarlo

El centro busca la empresa de prácticas para cada alumno y se compromete a que **al menos el 80 % del grupo** consiga un contrato, normalmente en la empresa donde hace las prácticas.

El agente lo presenta como un punto fuerte, con esta precisión: es un **compromiso del centro sobre el conjunto del grupo**, no una garantía de contrato para cada persona. Ejemplo: «Inclou pràctiques en empresa i el centre es compromet que almenys el 80 % del grup aconsegueixi feina, sovint a la mateixa empresa de pràctiques».

## Cursos ACTIC (confirmado por gerencia)

| | Nivel medio | Nivel avanzado |
|---|---|---|
| Precio | 109 € | 129 € |
| IVA | Exento (formación) | Exento (formación) |

- **Modalidad:** solo en línea, en el Moodle del centro. No se ofrecen presenciales porque la oferta subvencionada ya incluye contenidos ACTIC y así se amortiza el curso en línea.
- **Acceso:** se puede empezar cualquier día. Al pagar se da acceso durante un mes y después el alumno se presenta al examen. Si suspende, se renueva gratis un mes más (los 30 días que exige la Generalitat antes de repetir).
- **Pago:** transferencia bancaria o en efectivo en Torredembarra.
- **Examen:** Multimèdia es centro formador y examinador. Tras el curso, el alumno elige la fecha y solicita la plaza con al menos 15 días de antelación. Se examina en Torredembarra y paga la tasa de examen a la Generalitat.
- **Contenido del curso:** temas por competencias ACTIC con vídeo, material digital y tests que simulan la plataforma del examen. Tutorías personales por videoconferencia bajo demanda y consultas por correo en cualquier momento.
- **Cómo actúa el agente:** informa, registra al interesado y lo pasa al equipo para el pago y el acceso.

### Tasas de examen de la Generalitat (facilitadas por gerencia el 16/10/2026)

| Nivel | Tasa |
|---|---|
| 1 · Básico | 20,75 € |
| 2 · Medio | 27,60 € |
| 3 · Avanzado | 34,45 € |

- **Exención total:** personas en paro, jubiladas, con discapacidad ≥ 33 % y alumnado de 4.º de ESO (en curso o acabado el año de la solicitud).
- **Bonificación del 30 %:** familias numerosas o monoparentales de categoría general (p. ej., 14,53 € en el nivel básico).
- **Bonificación del 50 %:** familias numerosas o monoparentales de categoría especial (p. ej., 10,38 € en el nivel básico).
- **10 % adicional** si la solicitud se presenta por vía electrónica.
- **Plazos:** solicitud en cualquier momento, un mes para pagar y tres meses desde el pago para hacer la prueba.

**[VERIFICAR antes de la puesta en marcha]** Estos importes deben cotejarse con la fuente oficial de la Generalitat (web de ACTIC o la ley de tasas vigente), porque se actualizan cada año. El agente los presenta como importes de referencia.

Sin pendientes, salvo verificar las tasas oficiales.

## Calendario

Horario, días de cierre de 2026 y 2027 e inicio de los cursos: [calendario-centro.md](calendario-centro.md).

## Preguntas para gerencia y coordinación

Ninguna pendiente sobre la oferta subvencionada.
