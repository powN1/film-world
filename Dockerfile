# ----------------------------
# 1️⃣ Build React frontend
# ----------------------------
FROM node:20-alpine AS client-build
WORKDIR /client

# Copy frontend package.json and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy all frontend files and build
COPY client ./
RUN npm run build

# ----------------------------
# 2️⃣ Build backend
# ----------------------------
FROM node:20-alpine
WORKDIR /app

# Copy backend package.json and install production dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy backend source code
COPY server ./

# Copy built frontend from previous stage
COPY --from=client-build /client/dist ./client/dist

# Set production environment
ENV NODE_ENV=production
EXPOSE 3002

# Start server
CMD ["node", "server.js"]

