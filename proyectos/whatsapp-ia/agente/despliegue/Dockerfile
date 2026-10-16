# Imagen del agente. Se construye desde la carpeta proyectos/whatsapp-ia:
#   docker build -f agente/despliegue/Dockerfile -t agente-whatsapp .
FROM node:22-slim
ENV NODE_ENV=production HOST=0.0.0.0 PUERTO=3000 DIR_DATOS=/datos DIR_CONOCIMIENTO=/app/conocimiento
WORKDIR /app/agente
COPY agente/package.json agente/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY agente/src ./src
COPY conocimiento /app/conocimiento
RUN mkdir -p /datos && chown node:node /datos
USER node
VOLUME /datos
EXPOSE 3000
HEALTHCHECK --interval=60s --timeout=5s CMD node -e "fetch('http://127.0.0.1:3000/salud').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "--disable-warning=ExperimentalWarning", "src/servidor.ts"]
