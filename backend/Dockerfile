FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

COPY tsconfig.json ./
COPY src ./src/

RUN npx prisma generate
RUN npx tsc

# ---- Production ----
FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["npm", "start"]
