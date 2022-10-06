FROM node:16 AS BUILD_IMAGE

ENV NODE_ENV "production"
ARG PORT

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]
