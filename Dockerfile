FROM node:22-alpine AS web-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE=/api
ARG VITE_DATA_MODE=server
ENV VITE_API_BASE=${VITE_API_BASE}
ENV VITE_DATA_MODE=${VITE_DATA_MODE}
RUN npm run build

FROM node:22-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json ./
RUN npm install --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV STATIC_DIR=/app/dist
ENV UPLOAD_DIR=/app/data/uploads
COPY --from=web-build /app/dist ./dist
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server ./server
COPY local-db ./local-db
RUN mkdir -p /app/data/uploads && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["sh", "-c", "node server/src/migrate.js && node server/src/index.js"]
