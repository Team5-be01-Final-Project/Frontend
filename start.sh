#!/usr/bin/env bash

cd /home/ubuntu/app/bps

docker-compose -f docker-compose.yml up -d --build --force-recreate