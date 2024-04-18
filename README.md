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
## Deploy URL
- https://bpssystem.store


## Github Action Deploy to EC2 with docker container
![GITHUB용 CI_CD FLOW](https://github.com/Team5-be01-Final-Project/Frontend2/assets/148880521/f8001964-0e2a-4a5f-8606-27e1532868b7)


## Release History
- [v6.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v6.0.0)
  - 버그 수정 및 기타 디자인 수정
- [v5.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v5.0.0)
  - 디자인 및 기타 오류 수정
- [v4.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v4.0.0)
  - 권한 관리 추가.
- [v3.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v3.0.0)
  - 대시보드, My영업 및 매출 관리 기능 추가.
- [v2.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v2.0.0)
  - Docker, Nginx 사용, npm run build로 수정 및 쿠키 들어오는거 확인
- [v1.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v1.0.0)
  - Github Flow를 통해 EC2로 CI/CD 구축. (Docker 및 nginx는 사용하지 않고, npm run dev로 실행 확인)

