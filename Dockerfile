FROM node:18 AS builder

WORKDIR /app

COPY tailwind.config.ts ./tailwind.config.ts
COPY postcss.config.mjs ./postcss.config.mjs

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/app/globals.css ./app/globals.css
COPY --from=builder /app/app ./app

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "start"]
