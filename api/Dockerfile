FROM node:15.11.0

WORKDIR /app

COPY package.json ./
RUN npm i
COPY . .

EXPOSE 3000 9229

CMD npm run start:dev
