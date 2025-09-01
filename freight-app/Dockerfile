# --- Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# 1) faqat freight-app package manifestlarni ko'chiramiz
COPY package*.json ./

# 2) prod/dev deps o'rnatamiz
RUN npm ci

# 3) qolgan kodni ko'chiramiz
COPY . .

# 4) Prisma client va build
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# --- Runtime stage ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# build natijalari va package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# faqat prod deps
RUN npm ci --omit=dev

# ilova porti
ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/main.js"]
