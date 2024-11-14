# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Copy the environment variables
COPY .env .env

# Build the application
RUN npm run build

# Stage 2: Create the final image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app ./

# Install production dependencies
RUN npm install --only=production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]