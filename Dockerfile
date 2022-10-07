FROM node:18 AS BUILD_IMAGE

ENV NODE_ENV "production"
ARG PORT

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y handbrake-cli

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]
