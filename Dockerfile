# syntax=docker/dockerfile:1

# =================================================================
# Builder stage: install dependencies and compile TypeScript/assets
# =================================================================
FROM node:20-bookworm-slim AS builder

# Native modules (e.g. better-sqlite3) require build tooling
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Skip downloading Puppeteer's bundled Chromium; it is not used at runtime
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install dependencies (including devDependencies needed for the build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build the client bundle + bundled server
COPY . .
RUN npm run build

# Remove devDependencies to keep only what's needed at runtime
RUN npm prune --omit=dev

# =================================================================
# Runtime stage: minimal footprint image to run the app
# =================================================================
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Create a non-root user/group to run the application
RUN groupadd --system nodejs && useradd --system --gid nodejs --create-home nodejs

# Copy production dependencies and build artifacts from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/package.json ./package.json

# Ensure the non-root user owns the application files
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { if (r.statusCode !== 200) process.exit(1); process.exit(0); }).on('error', () => process.exit(1));"

CMD ["node", "dist-server/server.js"]
