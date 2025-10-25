# 1️⃣ Imagem base
FROM node:18

# 2️⃣ Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3️⃣ Copia package.json e package-lock.json
COPY package*.json ./

# 4️⃣ Instala dependências
RUN npm install

# 5️⃣ Copia todo o código da aplicação
COPY . .

# 6️⃣ Instala ts-node globalmente para rodar TS direto (opcional)
RUN npm install -g ts-node typescript

# 7️⃣ Expõe a porta que sua API usa
EXPOSE xxxx

# 8️⃣ Comando para iniciar o app
CMD ["npm", "run", "start"]
