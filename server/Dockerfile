# 1️⃣ Build frontend
FROM node:18-alpine AS client-build
WORKDIR /client
COPY ../client/package*.json ./
RUN npm install
COPY ../client .
RUN npm run build

# 2️⃣ Build backend
FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

# Copy built frontend into server
COPY --from=client-build /client/dist ../client/dist

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "server.js"]

