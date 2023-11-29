FROM node:18-alpine

ENV DB_HOST=null
ENV DB_USER=null
ENV DB_PWD=null
ENV DB_NAME=null
ENV SECRET_KEY=null

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]