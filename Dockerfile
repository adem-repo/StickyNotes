FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm -g config set user root
RUN npm -g install browser-sync
RUN yarn

COPY . /usr/src/app

CMD browser-sync start --server --files "src/**" --ss "public"
