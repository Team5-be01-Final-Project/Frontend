#!/usr/bin/env bash

cd /home/ubuntu/app/bps
# Docker Compose를 사용하여 컨테이너를 시작합니다.

# vue 프로젝트 빌드
npm install
npm run build

sudo docker compose -f docker-compose.yml up -d --build --force-recreate
