FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Run build (like Vercel)
RUN npm run build

# Default command for CI
CMD ["echo", "✅ Build completed successfully"]
