FROM node:alpine

WORKDIR /opptjening-app

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8080
CMD ["npm", "run", "start"]