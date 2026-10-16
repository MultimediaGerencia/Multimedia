# Base de conocimiento del agente

## Oferta formativa 2026-2027

Fuente: hoja interna «FORMACIONS 26-27 PROVISIONAL» (actualizada el 02/10/2026), entregada por gerencia el 16/10/2026. De ella **solo se han extraído datos de los cursos**. El seguimiento de docentes (nombres, teléfonos y tarifas) son datos personales y no entran en el repositorio ni en el agente.

Archivo: [oferta-2026-27.csv](oferta-2026-27.csv) (34 filas, separador «;»).

| Programa | Organismo | Colectivo | Estado | Cursos |
|---|---|---|---|---|
| PIMEC | Consorci per a la Formació Contínua (los cursos los concede a PIMEC; Multimèdia los imparte para PIMEC) | Persones treballadores (prioritari; també poden haver-hi persones aturades) | **Aprobado** | 16 |
| Certificado profesional ADGG0208 (nivel 2, grado C) | Consorci per a la Formació Contínua | Persones treballadores | Pendiente de resolución | ADGG0208 + PRL básico |
| Forma i Contracta | SOC | Persones aturades | Pendiente de resolución | ADGG0208 + PRL, derechos laborales, igualdad, ACTIC. Incluye prácticas en empresa y compromiso de inserción (ver abajo) |
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

1. **Faltan fechas concretas, horario y sede.** Confirmado por gerencia: todo es **presencial** y empieza a **principios de enero de 2027**. Mientras no haya fechas concretas, el agente dirá «inicio previsto a principios de enero».
2. **Enlaces cambiados en PIMEC.** En 11 de los 16 cursos, la columna «LINK PROGRAMA» apunta a la ficha de otro curso (por ejemplo, Biomagnetisme → ficha de Java Back End). Se ha usado la columna «PROGRAMA», que sí coincide con cada curso.
3. **Horas de los certificados FOAP.** La hoja indica ADGD0308 660 + 220, ADGG0508 352 + 88, IFCD0110 480 + 80 y SSCS0208 337 + 112,5. Hay que confirmar si la segunda cifra son prácticas y cuál es el total oficial.
4. **ADGG0408 y FCOV24 (FOAP), y las acciones de Forma i Contracta**, no tienen horas ni nivel en la hoja.
5. **El PRL básico (FCOS02) del bloque del Consorci** figura con organismo SOC.
6. **Erratas en los nombres**: «PUBLCACIÓ», «ADMINSITRATIUS», «SOCISANITÀRIA», «RELACIO». El agente usará los nombres oficiales.
7. **Código dudoso**: «CTRHI0015» probablemente es CTRH0015.

## Último curso de 2026

Según la captura del calendario de noviembre de 2026:

- **«Eines coaching 1»** (programa PIMEC): 6 sesiones, los días 11, 13, 16, 18, 20 y 23 de noviembre de 2026, en Torredembarra. Es el último curso que empieza este año.
- **[Confirmar]** horario y plazas libres.

## Forma i Contracta: cómo explicarlo

El centro busca la empresa de prácticas para cada alumno y se compromete a que **al menos el 80 % del grupo** consiga un contrato, normalmente en la empresa donde hace las prácticas.

El agente lo presenta como un punto fuerte, con esta precisión: es un **compromiso del centro sobre el conjunto del grupo**, no una garantía de contrato para cada persona. Ejemplo: «Inclou pràctiques en empresa i el centre es compromet que almenys el 80 % del grup aconsegueixi feina, sovint a la mateixa empresa de pràctiques».

## Calendario

Horario, días de cierre de 2026 y 2027 e inicio de los cursos: [calendario-centro.md](calendario-centro.md).

## Preguntas para gerencia y coordinación

1. ¿Los 4 módulos de estética IMPE0110 (Consorci, filas 51 a 54 de la hoja) están solicitados? ¿Se pueden anunciar?
