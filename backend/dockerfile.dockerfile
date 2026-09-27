# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests first so Docker caches dependency installation
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy application source
COPY src ./src
COPY db ./db
COPY scripts ./scripts

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /app /app

USER app

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/index.js"]
