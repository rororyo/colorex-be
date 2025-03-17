###################
# BUILD FOR PRODUCTION
###################

FROM oven/bun:latest AS build

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

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
