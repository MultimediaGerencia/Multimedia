# Despliegue en el servidor

## Qué servidor hace falta

| | Mínimo para el piloto | Recomendado (con notas de voz, fase 2) |
|---|---|---|
| Tipo | Servidor virtual (VPS) con **Ubuntu 24.04 LTS**, 64 bits | Igual |
| CPU / RAM | 2 vCPU, 4 GB | 4 vCPU, 8 GB |
| Disco | 40 GB SSD | 80 GB SSD |
| Ubicación | España o la UE (RGPD) | Igual |
| Red | IP pública fija; puertos 22, 80 y 443 abiertos | Igual |
| Acceso | SSH con usuario administrador (sudo) | Igual |

**No hace falta** Windows, Apache, PHP, base de datos externa ni panel de control (Plesk, cPanel). El agente es un programa Node.js que guarda sus datos en un archivo SQLite. El HTTPS lo pone Caddy con un certificado gratuito de Let's Encrypt.

Además:
- **Copias de seguridad** diarias del servidor (o al menos de `/var/lib/agente-whatsapp` y `/etc/agente-whatsapp.env`).
- **Contrato de encargado del tratamiento** (art. 28 RGPD) con la empresa de alojamiento, porque el servidor guardará conversaciones con datos personales.
- **Un subdominio**, por ejemplo `whatsapp.multimediatarragona.com`, con un registro DNS de tipo A que apunte a la IP del servidor. Lo crea quien gestiona el dominio.

## Instalación

1. Descargar el proyecto (carpeta `proyectos/whatsapp-ia`) y copiarlo al servidor.
2. Ejecutar, como administrador:
   ```bash
   sudo bash agente/despliegue/instalar.sh whatsapp.multimediatarragona.com
   ```
   El script instala Node.js 22 y Caddy, crea el usuario `agente`, copia el programa a `/opt/agente-whatsapp`, crea el servicio y activa el cortafuegos (solo SSH, HTTP y HTTPS).
3. Rellenar las claves en `/etc/agente-whatsapp.env`. **Lo hace Multimèdia, no el proveedor**, y nunca se envían por correo.
4. Arrancar el servicio y comprobarlo:
   ```bash
   sudo systemctl start agente-whatsapp
   curl https://whatsapp.multimediatarragona.com/salud   # debe responder «ok»
   ```
5. En Meta, configurar el webhook con `https://whatsapp.multimediatarragona.com/webhook` y el `WHATSAPP_VERIFY_TOKEN` del archivo de configuración.

## Alternativa: Synology o cualquier equipo con Docker

En `despliegue/` hay un `Dockerfile` y un `docker-compose.yml` con dos contenedores: el agente y un túnel de Cloudflare. El túnel publica el agente en HTTPS **sin abrir puertos en el router**.

1. Crear el túnel en Cloudflare (Zero Trust → Networks → Tunnels), con el nombre público `whatsapp.multimediatarragona.com` apuntando a `http://agente:3000`. El subdominio tiene que estar gestionado en Cloudflare.
2. Copiar `.env.example` como `despliegue/agente.env`, rellenar las claves y añadir `TUNNEL_TOKEN=` con el token del túnel.
3. En Synology: Container Manager → Proyecto → Crear, con la carpeta del proyecto y el `docker-compose.yml`. En otro equipo: `docker compose up -d --build` desde `agente/despliegue`.

Recomendado para el piloto. Para el número real es preferible un servidor externo: no depende de la luz ni de la conexión de la oficina y no comparte equipo con las copias de seguridad.

## Mantenimiento

- Ver el registro: `sudo journalctl -u agente-whatsapp -f`
- Actualizar el código: copiar la nueva versión y volver a ejecutar `instalar.sh` (no toca la configuración ni los datos).
- Cambiar la oferta o el calendario: actualizar `conocimiento/` y volver a ejecutar `instalar.sh`.
