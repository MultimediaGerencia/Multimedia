#!/usr/bin/env bash
# Instalación del agente de WhatsApp de Multimèdia Tarragona en un servidor Ubuntu 24.04 LTS.
# Uso (como root, desde la carpeta proyectos/whatsapp-ia descomprimida):
#   sudo bash agente/despliegue/instalar.sh whatsapp.multimediatarragona.com
# Se puede volver a ejecutar para actualizar el código: no toca la configuración ni los datos.
set -euo pipefail

DOMINIO="${1:?Indica el dominio, por ejemplo: whatsapp.multimediatarragona.com}"
ORIGEN="$(cd "$(dirname "$0")/../.." && pwd)"   # carpeta proyectos/whatsapp-ia
DESTINO=/opt/agente-whatsapp
DATOS=/var/lib/agente-whatsapp
CONFIG=/etc/agente-whatsapp.env

[ "$(id -u)" -eq 0 ] || { echo "Ejecuta el script como root (sudo)."; exit 1; }
[ -f "$ORIGEN/agente/package.json" ] || { echo "No encuentro agente/package.json en $ORIGEN"; exit 1; }

echo "== Paquetes del sistema"
apt-get update -q
apt-get install -y -q ca-certificates curl gnupg debian-keyring debian-archive-keyring apt-transport-https ufw

echo "== Node.js 22"
if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=18)?0:1)' 2>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -q nodejs
fi

echo "== Caddy (servidor web con HTTPS automático)"
if ! command -v caddy >/dev/null; then
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -q
  apt-get install -y -q caddy
fi

echo "== Usuario y carpetas"
id agente >/dev/null 2>&1 || useradd --system --home "$DESTINO" --shell /usr/sbin/nologin agente
mkdir -p "$DESTINO" "$DATOS"
rm -rf "$DESTINO/agente" "$DESTINO/conocimiento"
cp -r "$ORIGEN/agente" "$ORIGEN/conocimiento" "$DESTINO/"
rm -rf "$DESTINO/agente/datos" "$DESTINO/agente/node_modules" "$DESTINO/agente/.env"
(cd "$DESTINO/agente" && npm ci --omit=dev --no-audit --no-fund)
chown -R root:root "$DESTINO"
chown -R agente:agente "$DATOS"
chmod 700 "$DATOS"

echo "== Configuración"
if [ ! -f "$CONFIG" ]; then
  cp "$DESTINO/agente/.env.example" "$CONFIG"
  echo "DIR_DATOS=$DATOS" >> "$CONFIG"
  echo "Creado $CONFIG: hay que rellenar las claves antes de arrancar."
fi
chown root:agente "$CONFIG"
chmod 640 "$CONFIG"

echo "== Servicio"
cp "$DESTINO/agente/despliegue/agente-whatsapp.service" /etc/systemd/system/
sed "s/__DOMINIO__/$DOMINIO/" "$DESTINO/agente/despliegue/Caddyfile" > /etc/caddy/Caddyfile
systemctl daemon-reload
systemctl enable agente-whatsapp >/dev/null
systemctl reload caddy || systemctl restart caddy

echo "== Cortafuegos (SSH, HTTP y HTTPS)"
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null

if grep -qE '^WHATSAPP_TOKEN=.+' "$CONFIG"; then
  systemctl restart agente-whatsapp
  echo "Agente reiniciado. Comprobación: curl https://$DOMINIO/salud"
else
  echo "Instalación hecha. Falta rellenar $CONFIG y ejecutar: systemctl start agente-whatsapp"
fi
