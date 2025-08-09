# Step 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# ✅ Pass environment variables during build
ARG SUPABASE_URL
ARG SUPABASE_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_KEY=$SUPABASE_KEY

RUN echo "DEBUG: NEXT_PUBLIC_SUPABASE_URL is $NEXT_PUBLIC_SUPABASE_URL"
RUN echo "DEBUG: NEXT_PUBLIC_SUPABASE_KEY is $NEXT_PUBLIC_SUPABASE_KEY"

# Build the Next.js app
RUN npm run build

# Step 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "start"]
