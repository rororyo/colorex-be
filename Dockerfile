# Base Image for Build
FROM oven/bun:latest AS build

WORKDIR /usr/src/app

# Set Node Path for module resolution
ENV NODE_PATH=/usr/src/app

# Copy package files first (faster caching)
COPY package.json bun.lockb tsconfig.json ./

# Install dependencies
RUN bun install --no-save

# Copy entire source code
COPY . .

# Debug: Ensure src files exist
RUN ls -la src/

# Install reflect-metadata explicitly (if needed)
RUN bun add reflect-metadata

# Build NestJS (using npx for safer execution)
RUN npx nest build

##################
# PRODUCTION
##################

FROM oven/bun:latest AS production

WORKDIR /usr/src/app

# Set Node Path for module resolution
ENV NODE_PATH=/usr/src/app

# Copy package files
COPY package.json bun.lockb tsconfig.json ./

# Install only production dependencies
RUN bun install --production --no-save

# Copy compiled build artifacts
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/database ./database

# Start the server
CMD ["bun", "run", "dist/src/main.js"]
