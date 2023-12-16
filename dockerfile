FROM node:20-alpine

WORKDIR /app

EXPOSE 5173

COPY . /app

RUN npm install

CMD ["npm","run","dev"]