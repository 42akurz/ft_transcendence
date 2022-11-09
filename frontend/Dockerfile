FROM node:18

RUN apt-get update -y
RUN apt-get upgrade -y
RUN npm update -g npm

WORKDIR /frontend

COPY package*.json .

RUN  npm install

ENTRYPOINT ["npm", "run", "serve"]