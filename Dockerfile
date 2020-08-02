FROM node:9

RUN curl -o- -L https://yarnpkg.com/install.sh | bash && \
  npm install -g create-react-app

# Cache node_modules
COPY package.json yarn.lock /app/
RUN cd /app && yarn install

WORKDIR /app
