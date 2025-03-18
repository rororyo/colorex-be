###################
# BUILD FOR DEVELOPMENT
###################
FROM oven/bun:latest AS development

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install all dependencies (dev + prod)
RUN bun install --no-save

# Copy the application source code
COPY . .

# Set user to bun (not root)
USER bun

###################
# BUILD FOR PRODUCTION
###################
FROM oven/bun:latest AS build

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install all dependencies (dev + prod)
COPY --from=development /usr/src/app/node_modules ./node_modules

# Copy the full application source
COPY . .

# Build the application
RUN bun run build

# Remove dev dependencies to optimize production image
RUN bun install --production --no-save && bun cache clean

USER bun

###################
# PRODUCTION
###################
FROM oven/bun:latest AS production

WORKDIR /usr/src/app

# Copy only production dependencies
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy built application files
COPY --from=build /usr/src/app/dist ./dist

# Set user to bun (not root)
USER bun

# Start the server
CMD ["bun", "dist/src/main.js"]
