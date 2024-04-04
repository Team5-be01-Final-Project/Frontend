# 실행 단계
FROM nginx:latest as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

FROM node:20.11.0
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
RUN npm install vite
COPY . /app
RUN npm run build


