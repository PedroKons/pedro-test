# Usa a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copia os demais arquivos do projeto
COPY . .

# Expõe a porta 3000 para o container
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "server.js"]
