# Use the official Node.js image
FROM node:18-alpine

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml first (for better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --prod

# Copy the entire application source code
COPY . .

# Expose the port your app runs on (match `envConfig.app.port`)
EXPOSE 3000

# Set environment variables (optional, use .env in production)
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
