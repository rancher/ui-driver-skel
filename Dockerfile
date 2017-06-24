FROM node:4.8.2-alpine

MAINTAINER Hayahito Kawamitsu

RUN apk add --update git
RUN npm install bower -g
RUN npm install gulp -g

RUN git clone https://github.com/mittz/ui-driver-ecl.git
WORKDIR /ui-driver-ecl
RUN npm install && bower install --allow-root
RUN npm run build
