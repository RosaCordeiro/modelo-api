FROM ubuntu:22.04

# Instala Node 20 e Java 17
RUN apt-get update && apt-get install -y curl ca-certificates gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs openjdk-17-jdk openjdk-17-jre build-essential python3 \
    && npm install -g npm@latest

# Configura variáveis de ambiente do Java
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}

# Cria link simbólico para libjvm.so
RUN mkdir -p /usr/lib/jvm/java-17-openjdk-amd64/lib/server && \
    ln -s /usr/lib/jvm/java-17-openjdk-amd64/lib/server/libjvm.so /usr/lib/libjvm.so

# Cria diretório da aplicação
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copia dependências
COPY package.json /usr/src/app/
COPY .npmrc /usr/src/app/
RUN npm install

# Copia o código
COPY . /usr/src/app

# 7️⃣ Expõe a porta que sua API usa
EXPOSE xxxx

# 8️⃣ Comando para iniciar o app
CMD ["npm", "run", "start"]
