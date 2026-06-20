FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

CMD ["sh", "-c", "cp -r /app/dist/* /output/ && echo 'Frontend build copied to shared volume'"]