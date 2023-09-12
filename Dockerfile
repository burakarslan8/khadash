FROM node:12

WORKDIR /usr/src/khadash

COPY fan.sh /usr/src/khadash/fan.sh
RUN chmod +x /usr/src/khadash/fan.sh

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . /usr/src/khadash

# PORT
EXPOSE 1024

CMD ["node", "server.js"]
