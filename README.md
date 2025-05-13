# Legit Farm for Honeygain Automation

Automatize downloads legítimos de Steam e vídeos do YouTube para gerar tráfego de dados contínuo e maximizar seus ganhos no Honeygain.

## Índice

- [Descrição](#descrição)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Argumentos](#argumentos)
- [Exemplos](#exemplos)
- [Demonstração de Potencial](#demonstração-de-potencial)
- [Boas práticas](#boas-práticas)
- [Contribuindo](#contribuindo)

## Descrição

O **Legit Farm** é uma automação que gera tráfego de dados verdadeiro através de ciclos de download:
- Uso de `steamcmd` para instalar/atualizar jogos gratuitos (ex.: App ID `480`).
- Uso de `yt-dlp` para baixar vídeos do YouTube.

Esse tráfego legítimo é consumido pelo aplicativo Honeygain, aumentando de forma contínua seus créditos sem violar os termos de uso.

## Pré-requisitos

- Python 3.8 ou superior
- [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) instalado e configurado
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) instalado (`pip install yt-dlp`)
- Conta no [Honeygain](https://honeygain.com/) instalada e em execução
- Conexão de Internet estável

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/legit-farm-honeygain.git
   cd legit-farm-honeygain
   ```
2. (Opcional) Crie e ative um ambiente virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```
3. Instale `yt-dlp`:
   ```bash
   pip install yt-dlp
   ```

## Configuração

1. Prepare suas credenciais Steam:
   - Informe `--username` e `--password` ao executar o script.
2. Crie um arquivo de texto com URLs do YouTube (um por linha), ex.: `videos.txt`.
3. Opcionalmente, ajuste os parâmetros de ciclo (intervalos, número de vídeos, App ID, etc.) diretamente nos argumentos.

## Uso

```bash
python automation.py \
  --username SEU_USUARIO_STEAM \
  --password SUA_SENHA_STEAM \
  --app-id 480 \
  --install-dir /caminho/para/steam_apps/480 \
  --video-file videos.txt \
  --yt-output ./yt_downloads \
  --steamcmd-path /caminho/para/steamcmd \
  --log-file automation.log
```

Exemplo simplificado (Windows):

```powershell
python automation.py --username meuUsuario --password minhaSenha --app-id 480 --install-dir C:\SteamApps\480 --video-file yts.txt
```

O script roda em loop infinito, alternando ciclos de download de Steam e YouTube. Pressione `Ctrl+C` para interromper.

### Argumentos

- `--username`: Usuário Steam (obrigatório)
- `--password`: Senha Steam (obrigatório)
- `--app-id`: ID do aplicativo Steam (ex.: `480` para Spacewar) (obrigatório)
- `--install-dir`: Diretório de instalação do Steam (obrigatório)
- `--video-file`: Arquivo texto com URLs do YouTube (obrigatório)
- `--yt-output`: Pasta de saída para downloads de vídeo (padrão: `yt_downloads`)
- `--steamcmd-path`: Caminho para o executável `steamcmd` (remova se estiver no PATH)
- `--log-file`: Arquivo de log (padrão: `automation.log`)

## Demonstração de Potencial

| Ciclo | Tráfego Steam | Vídeos YouTube | Total (GB) | Ganho Estimado |
|-------|---------------|----------------|------------|----------------|
| 1     | ~5 GB         | ~1 GB          | ~6 GB      | ~0,12 USD      |
| 2     | ~5 GB         | ~1 GB          | ~6 GB      | ~0,12 USD      |
| 3     | ~5 GB         | ~1 GB          | ~6 GB      | ~0,12 USD      |
|**Total Diário**|           |                | **~18 GB** | **~0,36 USD**  |

> Esses valores são aproximados e variam conforme a qualidade do vídeo e atualizações do Steam. Ajuste o número de ciclos para aumentar seu rendimento.

## Boas práticas

- Monitore sua conexão: evite saturar sua banda em horários de pico.
- Utilize SSD para reduzir tempo de instalação/remoção.
- Mantenha o Honeygain rodando em background e verifique regularmente seu painel de controle.

## Contribuindo

1. Fork este repositório
2. Crie uma branch (`git checkout -b minha-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

---
Crie seus ciclos de download e transforme seu tráfego em ganhos com o **Legit Farm Honeygain Automation**! 🚀