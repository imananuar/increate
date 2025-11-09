
# # ===== Stage 1: Build Angular App =====
# FROM node:20-alpine AS build
# WORKDIR /app

# # Copy dependencies and install
# COPY package*.json ./
# RUN npm ci

# # Copy all source files
# COPY . .

# # Build Angular app in production mode
# RUN npm run build -- --configuration production

# # ===== Stage 2: Serve with Nginx =====
# FROM nginx:alpine

# RUN rm -rf /usr/share/nginx/html/*
# # Copy build output from Stage 1 (adjust project name if needed)
# COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# # Copy custom Nginx config if you have one (optional)
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# =========================================
# Stage 1: Build the Angular Application
# =========================================
# =========================================
# Stage 1: Build the Angular Application
# =========================================
ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

# Use a lightweight Node.js image for building (customizable via ARG)
FROM node:${NODE_VERSION} AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .

# Build the Angular application
RUN npm run build 

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Use a built-in non-root user for security best practices
USER nginx

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 8080 to allow HTTP traffic
# Note: The default NGINX container now listens on port 8080 instead of 80 
EXPOSE 80

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]