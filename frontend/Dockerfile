FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
ARG API_URL
ENV VITE_API_URL=${API_URL}
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/static/photos /usr/share/nginx/html/static/photos
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
