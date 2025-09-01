# --- Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# If you have a root package.json (you do), install root deps first
COPY package*.json ./
RUN npm ci

# Copy the whole repo
COPY . .

# Move into the API package
WORKDIR /app/apps/api

# If api has its own package.json (it does per your earlier info), install its deps
RUN npm ci

# Build & generate Prisma client
RUN npm run build
RUN npx prisma generate --schema=./prisma/schema.prisma

# --- Runtime stage ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and api package manifest
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./

# Install only prod deps for the api package
RUN npm ci --omit=dev

# App port
ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/main.js"]
