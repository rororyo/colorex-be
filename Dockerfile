###################
# BUILD FOR PRODUCTION
###################

FROM oven/bun:latest AS build

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install dependencies (force Bun to allow postinstalls)
RUN bun install --no-save

# Copy source code
COPY . .

# Ensure TypeScript paths resolve properly
RUN bun run tsc --traceResolution

# Compile TypeScript
RUN bun run build

###################
# PRODUCTION
###################

FROM oven/bun:latest AS production

WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Start the server
CMD ["bun", "run", "dist/src/main.js"]
