###################
# BUILD FOR PRODUCTION
###################

FROM oven/bun:latest AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json bun.lockb ./

# Copy installed dependencies from development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command
RUN bun run build

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Install only production dependencies
RUN bun install --frozen-lockfile --production

USER node

###################
# PRODUCTION
###################

FROM oven/bun:latest AS production

WORKDIR /usr/src/app

# Copy built code and dependencies from build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD ["bun", "run", "dist/src/main.js"]