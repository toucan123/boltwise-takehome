# syntax=docker/dockerfile:1.3

FROM node:20.18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install

COPY . .

EXPOSE 3131
EXPOSE 9229

CMD [ "npm", "run", "watch"]
