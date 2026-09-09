FROM node:26-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY . .
ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/social_studio.db
EXPOSE 3000
CMD ["node", "src/server.js"]
