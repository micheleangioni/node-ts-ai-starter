FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app/

RUN npm run build

EXPOSE 3010

CMD [ "npm", "start" ]
