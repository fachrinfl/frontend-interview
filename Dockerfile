# Tahap build
FROM node:18 AS builder

WORKDIR /app

# Salin file konfigurasi Tailwind dan PostCSS terlebih dahulu
COPY tailwind.config.ts ./tailwind.config.ts
COPY postcss.config.mjs ./postcss.config.mjs

# Salin file package.json dan install dependensi
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Salin seluruh kode aplikasi
COPY . .

# Jalankan build aplikasi
RUN npm run build

# Tahap runtime
FROM node:18-slim

WORKDIR /app

# Salin hasil build dari tahap build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Salin file CSS global dan folder app
COPY --from=builder /app/app/globals.css ./app/globals.css
COPY --from=builder /app/app ./app

# Tentukan port yang akan digunakan
ENV PORT 3000
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
