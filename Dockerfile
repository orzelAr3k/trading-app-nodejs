FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/trading

COPY package*.json ./

RUN npm install

COPY dist .

EXPOSE 8888
CMD [ "node", "app.js" ]