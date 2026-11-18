# Parallax as one container, for a server run by Coolify (or plain Docker).
# How to deploy it: docs/coolify.md

# ---- build: install everything, build the app, then drop the build-only packages ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# ---- run ----
FROM node:22-bookworm-slim
# ffmpeg is optional for Parallax, but with it the Cinema page can join shots into one film
# and uploads get real thumbnails and durations.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    PARALLAX_DATA_DIR=/data \
    SUPER_MODE=mock

COPY --from=build --chown=node:node /app /app
# The database and every file people make live here. Mount a volume on /data, or they are
# lost each time the container is replaced.
RUN mkdir -p /data && chown node:node /data
VOLUME /data
USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0"]
