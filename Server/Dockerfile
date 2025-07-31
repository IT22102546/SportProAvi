# Use official Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy all other source files
COPY . .

# Create a non-root user and switch to it
RUN adduser -D appuser && chown -R appuser /app
USER appuser

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Expose the port your app runs on
EXPOSE 8000

# Command to run your application
CMD ["npm", "start"]