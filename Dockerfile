# Use an official Node.js image as the base
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install required dependencies (including Git)
RUN apk add --no-cache git

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm lock file first (to leverage caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN pnpm run build

# -- Create a new lightweight image --
FROM node:20-alpine AS runner

WORKDIR /app

# Install required dependencies (in case they are needed at runtime)
RUN apk add --no-cache git

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
