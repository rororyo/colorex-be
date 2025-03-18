FROM oven/bun:latest AS build

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install dependencies (including peer dependencies)
RUN bun install --no-save

# Copy source code
COPY . .

# Install reflect-metadata explicitly
RUN bun add reflect-metadata

# Compile TypeScript - modify to include migrations
RUN bun run tsc -p tsconfig.build.json

###################
# PRODUCTION
###################

FROM oven/bun:latest AS production

WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
# Copy migrations if needed in production
COPY --from=build /usr/src/app/database ./database

# Start the server
CMD ["bun", "run", "dist/src/main.js"]