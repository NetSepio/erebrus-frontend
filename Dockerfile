# ---- Build Stage ----
    FROM node:23-alpine AS builder

    # Install build dependencies
    RUN apk add --no-cache \
        python3 \
        make \
        g++ \
        libusb-dev \
        linux-headers \
        eudev-dev \
        pkgconfig
    
    # Set working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install all dependencies (needed to build)
    RUN npm install --force
    
    # Copy the rest of the app
    COPY . .
    
    # Build the Next.js app
    RUN npm run build
    
    # ---- Production Stage ----
    FROM node:23-alpine
    
    # Set working directory
    WORKDIR /app
    # Copy files from the build stage
COPY --from=builder /app /app

    # Expose port
    EXPOSE 3000
    
    # Start the app
    CMD ["npm", "start"]
    