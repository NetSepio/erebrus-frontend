# ---- Build Stage ----
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy your env file
COPY .env .env

# Install dependencies
COPY package*.json ./
RUN npm ci

# Rebuild native bindings
RUN npm rebuild

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:18-slim AS production

# Set working directory
WORKDIR /app

# Copy only required files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/*.js ./

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
