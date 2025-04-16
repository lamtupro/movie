# Sử dụng Node.js 18 làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các dependencies
RUN npm install

# Biến môi trường cho production
ENV NODE_ENV=production

# Build Strapi
RUN npm run build

# Expose cổng 1337 để chạy Strapi
EXPOSE 1337

# Lệnh khởi động Strapi
CMD ["npm", "start"]
