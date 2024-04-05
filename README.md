# BPS_Frontend Sever

## Project Settings
```
$ node --version
v20.11.0
$ npm --version
v10.5.0
$ docker --version
v24.0.5
$ nginx --v
nginx/1.18.0
```

## Project Setup

```sh
$ npm install -g npm@10.5.0
$ npm install vite
$ npm install axios
$ npm install -D sass
$ npm install js-cookie
$ npm install chart.js
$ npm install @fortawesome/fontawesome-free

```
## Compile and Hot-Reload for Development

```sh
npm run dev
```

## Compile and Minify for Production

```sh
npm run build
```

## Github Action Deploy to EC2 with docker container
![CI_CD FLOW](https://github.com/Team5-be01-Final-Project/Frontend2/assets/148880521/9a938183-64a8-4691-b0b9-7cd1308fee0e)

## Release History
- [v1.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v1.0.0)
  - Github Flow를 통해 EC2로 CI/CD 구축. (Docker 및 nginx는 사용하지 않고, npm run dev로 실행 확인)

