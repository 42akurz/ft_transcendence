FROM node:18

RUN apt-get update -y
RUN apt-get upgrade -y
RUN npm update -g npm

WORKDIR /backend

COPY uploads ./uploads
COPY package*.json .
COPY tsconfig*.json .

RUN npm install

ENTRYPOINT ["npm", "run", "start:dev"]