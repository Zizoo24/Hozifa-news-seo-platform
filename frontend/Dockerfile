# ---- Builder ----
FROM node:20-bookworm-slim AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src/

RUN npm run build

# ---- Serve with nginx ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
