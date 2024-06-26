# # 빌드 스테이지
# FROM node:20.11.0
# WORKDIR /app
# COPY package.json /app/package.json
# RUN npm install
# COPY . /app
# RUN npm run build

# # 서빙 스테이지
# FROM nginx:latest
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx/conf/default.conf /etc/nginx/conf.d/default.conf

# # vue npm build
# FROM node:20.11.0-alpine as build
# WORKDIR /app
# COPY package.json /app/package.json
# RUN npm install
# COPY . /app
# RUN npm run build


FROM nginx:latest

COPY --from=builder /app/bps/nginx/conf/default.conf /etc/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html
COPY --from=builder /app/bps/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["ngnix", "-g", "daemon off;"]