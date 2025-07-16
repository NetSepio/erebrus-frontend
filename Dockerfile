# -------- Build Stage --------
FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_PROJECT_ID
ENV NEXT_PUBLIC_PROJECT_ID=$NEXT_PUBLIC_PROJECT_ID

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

RUN echo "NEXT_PUBLIC_PROJECT_ID at build time: $NEXT_PUBLIC_PROJECT_ID"
RUN npm run build
