# Build phase
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production phase
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy a custom nginx config if needed, otherwise this is fine for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]