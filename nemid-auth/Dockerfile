FROM node

WORKDIR /service

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start

