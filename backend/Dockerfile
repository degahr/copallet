FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm install typescript -g

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
