# Aşama 1: Uygulamayı oluştur
FROM node:20-alpine AS builder

WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package.json .
COPY package-lock.json .

# Bağımlılıkları yükle
RUN npm install

# Geri kalan uygulama kodunu kopyala
COPY . .

# Uygulamayı oluştur
RUN npm run build

# Aşama 2: Üretim görüntüsünü Nginx ile oluştur
FROM nginx:alpine

# Oluşturucu aşamasındaki yapılan nesneleri kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Özel Nginx yapılandırmasını kopyala, eğer gerekliyse
# COPY nginx.conf /etc/nginx/nginx.conf

# Port 80'i dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]