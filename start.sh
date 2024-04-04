#!/usr/bin/env bash


# 프로젝트 디렉토리로 이동
cd /home/ubuntu/app/bps

# Docker Compose를 사용하여 서비스 시작
sudo docker compose -f docker-compose.yml up -d --build --force-recreate