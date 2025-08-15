# -------- Build Stage --------
FROM node:18-alpine AS builder

WORKDIR /app
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libusb-dev \
    linux-headers \
    eudev-dev \
    pkgconfig

COPY package*.json ./
RUN npm install --force

COPY . .

# Build the application
RUN npm run build

# -------- Production Stage --------
FROM node:18-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
