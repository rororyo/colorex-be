FROM oven/bun:latest AS build

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --no-save

# Copy source code
COPY . .

# Install reflect-metadata explicitly
RUN bun add reflect-metadata

# Build the application
RUN bun run build

##################
# PRODUCTION
##################

FROM oven/bun:latest AS production

WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lockb ./

# Install production dependencies only
RUN bun install --production --no-save

# Copy build artifacts
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/database ./database

# Start the server
CMD ["bun", "run", "dist/src/main.js"]