FROM dbutech/node-java:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
# COPY .npmrc /usr/src/app/ 

RUN npm install
# Bundle app source
COPY . /usr/src/app

EXPOSE 3014
CMD ["npm","start"]
