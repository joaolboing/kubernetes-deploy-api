FROM node:22-alpine

RUN apk add curl --no-cache

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
  && chmod +x ./kubectl \
  && mv ./kubectl /usr/local/bin/kubectl

WORKDIR /app


ADD . /app
RUN npm install --production

CMD ["node","/app/index.js"]