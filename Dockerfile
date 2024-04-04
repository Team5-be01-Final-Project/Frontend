FROM node:20.11.0
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "build"]
