FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl ca-certificates gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs openjdk-17-jdk openjdk-17-jre build-essential python3 \
    && npm install -g npm@latest

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}

RUN mkdir -p /usr/lib/jvm/java-17-openjdk-amd64/lib/server && \
    ln -s /usr/lib/jvm/java-17-openjdk-amd64/lib/server/libjvm.so /usr/lib/libjvm.so

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY .npmrc /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 9999

CMD ["npm", "run", "start"]
