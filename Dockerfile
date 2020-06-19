FROM node:8

ADD . /app

WORKDIR /app

RUN npm install --production
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
 
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

CMD ["node","/app/index.js"]