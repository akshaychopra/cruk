FROM node:14-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY / ./src
COPY index.d.ts ./
COPY .env ./
RUN npm install
RUN npm run build

FROM node:14-alpine
WORKDIR /usr
COPY package.json ./
RUN npm install --only=production
COPY index.d.ts ./
COPY .env ./
COPY --from=0 /usr/dist .
RUN npm install pm2 -g
EXPOSE 80
CMD ["pm2-runtime","index.js"]