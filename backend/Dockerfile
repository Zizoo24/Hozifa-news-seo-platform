# ---- Builder ----
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm install

COPY tsconfig.json ./
COPY src ./src/

RUN npx prisma generate
RUN npx tsc

# ---- Production ----
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 appgroup \
    && useradd --uid 1001 --gid appgroup --shell /bin/false --create-home appuser

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

ENV NODE_ENV=production
RUN npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/dist ./dist

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

CMD ["npm", "start"]
