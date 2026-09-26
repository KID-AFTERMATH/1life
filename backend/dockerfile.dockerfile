FROM node:20-alpine

WORKDIR /app

# Install deps first (leverages Docker layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the source
COPY src ./src
COPY db ./db

EXPOSE 3000
CMD ["node", "src/index.js"]