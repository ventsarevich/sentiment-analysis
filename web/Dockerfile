FROM node:15.11.0 as builder

WORKDIR /app

COPY ./package.json ./
RUN npm i
COPY . .

EXPOSE 3000

CMD npm run start
