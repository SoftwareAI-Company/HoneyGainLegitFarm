FROM python:3.12-slim

# Instalar dependências do sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget curl gnupg ca-certificates lib32stdc++6 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Node.js (via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install --platform=linux --arch=x64 \
    npm install -g vite

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential libssl-dev pkg-config libstdc++6

# Instalar dependências Node.js (incluindo devDependencies)
COPY package.json package-lock.json ./
RUN npm ci --platform=linux --arch=x64


# Criar diretório da aplicação
WORKDIR /app

# Copiar os arquivos do projeto
COPY . /app

