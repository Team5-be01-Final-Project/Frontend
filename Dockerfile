# 실행 단계
FROM nginx:latest 
RUN mkdir /app
COPY /app/dist /app
COPY /nginx/conf/default.conf /etc/nginx/conf/


FROM node:20.11.0
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
RUN npm install vite
RUN npm install chart.js
COPY . /app
RUN npm run build

