FROM node:18.20-alpine

WORKDIR /app

COPY . .

RUN npm install -g npm@10
RUN npm install

CMD [ "npm", "start" ]

EXPOSE 8080