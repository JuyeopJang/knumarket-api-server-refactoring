FROM node:14

WORKDIR /usr

COPY package*.json ./

RUN npm install -g pm2 && pm2 install typescript && npm install

ADD . .

EXPOSE 5000

ENTRYPOINT ["npm", "run", "deploy"]

