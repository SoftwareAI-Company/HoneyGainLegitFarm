
# 🐝 YouTube Download Automation - Honeygain Legit Traffic Generator

Automatize o download contínuo de vídeos longos do YouTube (documentários, aulas e tutoriais) para gerar tráfego legítimo, útil para maximizar seus ganhos com o Honeygain.

---

📦 **Imagem Docker:** `docker.io/mediacutstudio/ytdownloadautomation`  
📁 **Repositório:** [https://github.com/SoftwareAI-Company/HoneyGainLegitFarm](https://github.com/SoftwareAI-Company/HoneyGainLegitFarm)

---

## 📌 Visão Geral

Esta imagem automatiza o download periódico de vídeos do YouTube com duração mínima de 30 minutos e qualidade até 720p, simulando consumo real de banda larga.

- Utiliza `yt-dlp` para baixar os vídeos.
- Gera uma lista renovada a cada ciclo com vídeos longos e relevantes.
- Cria tráfego contínuo e legítimo para maximizar ganhos com Honeygain.
- Loga todas as atividades em `automation.log`.

---

## ⚙️ Variáveis de Ambiente

As variáveis devem ser definidas via arquivo `.env` (exemplo: `Keys/example.env`):

```env
YT_VIDEO_FILE=yts.txt         # Arquivo com URLs dos vídeos a baixar
YT_OUTPUT=yt_downloads        # Pasta de destino dos downloads
INTERVAL=1                    # Intervalo entre ciclos (em horas ou minutos customizáveis)
YT_FLAG=True                  # Flag para indicar modo YouTube ativo
YT_RANGE=3                    # Quantidade de vídeos a baixar por ciclo
LOG_FILE=automation.log       # Arquivo de log
````

---

## 🚀 Como Usar

### 1. Baixar a imagem

```bash
docker pull mediacutstudio/ytdownloadautomation
```

### 2. Executar o container

```bash
docker run -d \
  --name yt-auto \
  --env-file Keys/example.env \
  -v $(pwd)/yt_downloads:/app/yt_downloads \
  mediacutstudio/ytdownloadautomation
```

> 💡 O volume local permite acesso aos vídeos baixados fora do container.

---

## 🧠 Como Funciona

### Etapas:

1. Lê as URLs de vídeos de `yts.txt`.
2. Executa `yt-dlp` para baixar os vídeos em qualidade até 720p.
3. Remove diretórios antigos e recria a estrutura de saída.
4. A cada ciclo, regenera automaticamente a lista `yts.txt` com novos vídeos longos e válidos.
5. Repete indefinidamente com logs salvos em `automation.log`.

---

## 📊 Exemplo de Logs

```log
2025-05-20 14:00:01 - INFO - === yt cycle round 1 ===
2025-05-20 14:00:01 - INFO - Running: yt-dlp -o yt_downloads/%(title)s.%(ext)s https://youtube.com/watch?v=...
2025-05-20 14:00:45 - INFO - yt cycle 1 success
2025-05-20 14:01:00 - INFO - Written 30 URLs to yts.txt
```

---

## ✅ Requisitos do Container

* `python:3.12-slim` com dependências mínimas
* `yt-dlp` instalado via `requirements.txt`
* Scripts `automation.py` e `DownloadList.py` inclusos e prontos para execução
* Compatível com ambientes com pouca RAM/CPU

---

## 🔐 Observações

* O conteúdo dos vídeos é buscado com palavras-chave amplas e genéricas.
* Você pode editar o script `DownloadList.py` para alterar o tipo de vídeo procurado (por exemplo: aulas de programação, filmes, entrevistas).
* Certifique-se de que sua conexão suporta o volume de tráfego esperado para evitar throttling.

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que deseja alterar.

---

## 📄 Licença

MIT © MediaCut Studio


