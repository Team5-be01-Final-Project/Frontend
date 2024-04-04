#!/usr/bin/env bash

# 스크립트 실행 중 에러 발생 시 중단
set -e

# 터미널 로그 출력 활성화
set -x

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/app/bps

# Docker Compose를 사용하여 서비스 시작
sudo docker compose -f docker-compose.yml up -d --build --force-recreate
