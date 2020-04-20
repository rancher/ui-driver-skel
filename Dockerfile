FROM node:8

ADD . /app

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
