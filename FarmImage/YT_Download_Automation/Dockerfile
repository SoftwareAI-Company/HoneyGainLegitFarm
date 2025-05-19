FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends wget ca-certificates gnupg && \
    dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y --no-install-recommends lib32stdc++6 && \
    apt-get remove -y wget && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create application directory
WORKDIR /app

# Copiar e instalar dependências Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app
