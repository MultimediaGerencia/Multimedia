# Base de conocimiento del agente

## Oferta formativa 2026-2027

Fuente: hoja interna «FORMACIONS 26-27 PROVISIONAL» (actualizada el 02/10/2026), entregada por gerencia el 16/10/2026. De ella **solo se han extraído datos de los cursos**. El seguimiento de docentes (nombres, teléfonos y tarifas) son datos personales y no entran en el repositorio ni en el agente.

Archivo: [oferta-2026-27.csv](oferta-2026-27.csv) (34 filas, separador «;»).

| Programa | Organismo | Colectivo | Estado | Cursos |
|---|---|---|---|---|
| PIMEC | Consorci per a la Formació Contínua | Persones treballadores (prioritari; també poden haver-hi persones aturades) | **Aprobado** | 16 |
| Certificado profesional ADGG0208 (nivel 2, grado C) | Consorci per a la Formació Contínua | Persones treballadores | Pendiente de resolución | ADGG0208 + PRL básico |
| Forma i Contracta | SOC | Persones aturades | Pendiente de resolución | ADGG0208 + PRL, derechos laborales, igualdad, ACTIC |
| FOAP | SOC | Persones aturades | Pendiente de resolución (probablemente se apruebe una parte) | ADGD0308, ADGG0508, IFCD0110, SSCS0208 (2 grupos), ADGG0408, FCOV24 |
| Mòduls IMPE0110 (estética) | Consorci | Persones treballadores | **Sin confirmar** (no lo mencionaste) | 4 módulos |

## Cómo debe usar el agente el campo `estado`

| Estado | Qué puede decir el agente | Qué no puede decir |
|---|---|---|
| `aprobado` | Que el curso está previsto y aprobado, y explicar el colectivo, el nivel y las horas. Ofrecer apuntarse a la lista de interesados y dar cita | Fechas, horario o sede mientras esas columnas estén vacías |
| `pendiente_resolucion` | Que es un curso **previsto, pendiente de la resolución del organismo**, y ofrecer apuntarse a la **lista de espera** para avisar cuando se confirme (aviso solicitado por la persona) | Que se hará seguro, fechas o plazas |
| `sin_confirmar` | Nada. No lo menciona hasta que gerencia lo confirme | — |

Esto sigue tu indicación: lo pendiente se puede publicitar hasta que haya resolución, siempre como «previsto».

## Incidencias detectadas en la hoja (para revisar)

1. **Faltan fechas, horario, sede y modalidad** en todos los cursos. Sin eso, el agente solo puede decir «inicio previsto a partir de diciembre-enero» y apuntar a interesados.
2. **Enlaces cambiados en PIMEC.** En 11 de los 16 cursos, la columna «LINK PROGRAMA» apunta a la ficha de otro curso (por ejemplo, Biomagnetisme → ficha de Java Back End). Se ha usado la columna «PROGRAMA», que sí coincide con cada curso.
3. **Horas de los certificados FOAP.** La hoja indica ADGD0308 660 + 220, ADGG0508 352 + 88, IFCD0110 480 + 80 y SSCS0208 337 + 112,5. Hay que confirmar si la segunda cifra son prácticas y cuál es el total oficial.
4. **ADGG0408 y FCOV24 (FOAP), y las acciones de Forma i Contracta**, no tienen horas ni nivel en la hoja.
5. **El PRL básico (FCOS02) del bloque del Consorci** figura con organismo SOC.
6. **Erratas en los nombres**: «PUBLCACIÓ», «ADMINSITRATIUS», «SOCISANITÀRIA», «RELACIO». El agente usará los nombres oficiales.
7. **Código dudoso**: «CTRHI0015» probablemente es CTRH0015.

## Preguntas para gerencia y coordinación

1. ¿Los 4 módulos de estética IMPE0110 (Consorci) están solicitados? ¿Se pueden anunciar?
2. ¿Qué cursos se hacen en **Tarragona** y cuáles en **Torredembarra**? La hoja tiene columnas TGN y TOR vacías.
3. Fechas aproximadas de inicio de los cursos PIMEC aprobados, aunque sean orientativas (por ejemplo, «enero»).
4. ¿Son presenciales, en línea o mixtos?
5. Para Forma i Contracta: ¿el agente debe explicar el compromiso de contratación? ¿Hay empresa asociada que se pueda mencionar?
