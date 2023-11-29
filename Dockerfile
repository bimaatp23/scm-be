FROM node:18-alpine

ARG DB_HOST
ARG DB_USER
ARG DB_PWD
ARG DB_NAME
ARG SECRET_KEY

RUN echo "DB_HOST=${DB_HOST}"
RUN echo "DB_USER=${DB_USER}"
RUN echo "DB_PWD=${DB_PWD}"
RUN echo "DB_NAME=${DB_NAME}"
RUN echo "SECRET_KEY=${SECRET_KEY}"

ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PWD=$DB_PWD
ENV DB_NAME=$DB_NAME
ENV SECRET_KEY=$SECRET_KEY

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]