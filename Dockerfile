# -------- Build Stage --------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install OS packages required for building native modules (if needed)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libusb-dev \
    linux-headers \
    eudev-dev \
    pkgconfig

# Copy env file BEFORE npm install/build
COPY .env .env    

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the full project including .env
COPY . .

# Build the Next.js application
RUN npm run build

# -------- Production Stage --------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy production dependencies and build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/.env .env

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
