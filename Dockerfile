FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY tailwind.config.ts ./
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY .eslintrc.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
# RUN npm run build

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up permissions
RUN mkdir -p .next
RUN chown -R nextjs:nodejs .

# Switch to non-root user
USER nextjs

EXPOSE 3000

CMD ["npm", "run","dev"]

