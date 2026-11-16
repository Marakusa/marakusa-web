# syntax=docker/dockerfile:1

# ---- Build the frontend ----
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Install backend production dependencies ----
FROM node:24-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# ---- Runtime image ----
FROM node:24-alpine
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    FRONTEND_DIST=/app/frontend/dist \
    THUMBNAIL_UPLOAD_DIR=/app/backend/uploads/thumbnails

WORKDIR /app/backend
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ ./
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Uploaded thumbnails live here; mount a volume to keep them across container restarts
RUN mkdir -p uploads/thumbnails && chown -R node:node uploads
VOLUME /app/backend/uploads

USER node
EXPOSE 3000
CMD ["node", "server.js"]
