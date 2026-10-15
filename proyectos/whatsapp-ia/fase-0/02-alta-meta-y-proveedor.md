# Fase 0 · 2. Alta en Meta y elección de proveedor

## A. Cartera de empresa en Meta

La verificación tarda de días a semanas, así que conviene empezar ya. Lo hace gerencia.

1. Entra en https://business.facebook.com con la cuenta de Facebook de gerencia y crea la **cartera de empresa**, o usa la que ya tenga la página de Facebook del centro.
2. Datos de la empresa:
   - Razón social: Multimedia Tarragona, S.L.
   - Dirección
   - Teléfono
   - Web
   - Correo del dominio, por ejemplo gerencia@multimediatarragona.com
3. Activa la **verificación en dos pasos** para todas las personas administradoras.
4. Añade una **segunda persona administradora** de confianza, para no depender de una sola cuenta.
5. Ve a **Configuración del negocio → Centro de seguridad → Verificación del negocio** y prepara:
   - CIF;
   - escritura o certificado del Registro Mercantil, o un recibo de suministros a nombre de la empresa;
   - verificación del dominio multimediatarragona.com, con un registro DNS o un archivo en la web (quien gestione la web).
6. Añade un **método de pago** a la cuenta de WhatsApp en cuanto exista. Sin método de pago, Meta corta las respuestas al superar las 1.000 gratuitas del mes.

**Todavía no**: no crees la app en Meta for Developers ni registres el número en la API. Si se hace sin el proveedor, se puede perder la coexistencia con la app del móvil.

## B. Proveedor oficial con coexistencia

La coexistencia solo se activa a través del registro guiado de un proveedor oficial (BSP o Tech Provider). Pedimos presupuesto a dos o tres.

| Proveedor | Por qué | Contacto |
|---|---|---|
| 360dialog (Berlín) | Solo da la API, sin recargo sobre las tarifas de Meta, unos 49 €/mes. Encaja con un agente propio | https://360dialog.com |
| **[Alternativa 1]** | Otro BSP europeo de solo API | — |
| **[Alternativa 2]** | Para comparar | — |

### Correo modelo para pedir presupuesto

> **Asunto:** Presupuesto WhatsApp Business API con coexistencia – Multimèdia Tarragona
>
> Hola,
>
> Somos Multimèdia Tarragona, un centro de formación de Tarragona. Queremos conectar nuestro número de WhatsApp Business a la API oficial (Cloud API) para un agente de atención propio, manteniendo la app WhatsApp Business en el móvil (coexistencia).
>
> ¿Podéis confirmarnos?
>
> 1. Si ofrecéis coexistencia para números de España, con sincronización del historial y de los mensajes enviados desde la app (smb_message_echoes).
> 2. Si los avisos (webhooks) se reenvían completos a nuestro servidor y podemos enviar mensajes por API (formato Cloud API).
> 3. La cuota mensual y si aplicáis algún recargo sobre las tarifas de Meta.
> 4. Si firmáis contrato de encargado del tratamiento (art. 28 RGPD), dónde se alojan los datos y qué subencargados usáis.
> 5. Si es compatible con plantillas en catalán, WhatsApp Flows y nombres de usuario (BSUID).
> 6. El tiempo de alta y el soporte en español.
>
> Volumen previsto: **[COMPLETAR]** conversaciones al mes.
>
> Gracias,
> **[Nombre]** – Gerencia, Multimèdia Tarragona

## C. Requisitos del número antes del alta

- [ ] App WhatsApp Business actualizada (versión 2.24.17 o superior).
- [ ] Número con uso activo en la app desde hace al menos 7 días.
- [ ] Hacer una **copia de seguridad** de los chats antes del alta.
- [ ] Saber qué dispositivos hay vinculados: se desvinculan y luego se pueden volver a vincular (WhatsApp para Windows no es compatible).
