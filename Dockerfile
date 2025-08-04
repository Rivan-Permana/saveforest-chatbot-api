# Gunakan image nodejs resmi
FROM node:18

# Set direktori kerja
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua source code
COPY . .

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Jalankan aplikasi
CMD ["node", "server.js"]
