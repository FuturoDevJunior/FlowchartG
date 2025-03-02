# ====================================
# FLOWCHART-G DOCKER BUILD
# ====================================

# ====================================
# BUILD STAGE
# ====================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Add labels for better container identification
LABEL maintainer="DevFerreiraG"
LABEL description="FlowchartG - Interactive Flowchart Creator"
LABEL version="1.0.0"

# Install dependencies with cache optimization
COPY package*.json ./
RUN npm ci --quiet

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# ====================================
# PRODUCTION STAGE 
# ====================================
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]