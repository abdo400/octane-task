# Stage 1: Build the application
FROM node:18 as builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including dev dependencies
RUN npm install

# Install NestJS CLI globally to make `nest` command available
RUN npm install -g @nestjs/cli

# Copy the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Serve the application
FROM node:18 as runtime

# Set working directory
WORKDIR /usr/src/app

# Copy only the build artifacts
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./

# Install production dependencies only
RUN npm install

# Install NestJS CLI globally in the runtime stage to use the `nest` command
RUN npm install -g @nestjs/cli

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npx", "nodemon", "-r", "tsconfig-paths/register", "src/main.ts"]
