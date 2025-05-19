FROM python:3.12-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install SteamCMD dependencies and SteamCMD
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget ca-certificates gnupg && \
    dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y --no-install-recommends lib32stdc++6 && \
    mkdir -p /steamcmd && \
    cd /steamcmd && \
    wget -qO steamcmd_linux.tar.gz https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz && \
    tar -xzf steamcmd_linux.tar.gz && \
    rm steamcmd_linux.tar.gz && \
    ln -s /steamcmd/steamcmd.sh /usr/local/bin/steamcmd && \
    apt-get remove -y wget && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir yt-dlp flask

# Create application directory
WORKDIR /app

# Copiar e instalar dependências Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app
