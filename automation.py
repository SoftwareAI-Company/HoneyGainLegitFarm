# -----------------------------------------
# Guia de Instalação do SteamCMD no Windows
# -----------------------------------------
# 1. Baixe o SteamCMD para Windows:
#    https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip
# 2. Extraia o conteúdo do ZIP em uma pasta de sua preferência,
#    por exemplo: C:\SteamCMD
# 3. (Opcional) Adicione C:\SteamCMD ao PATH do sistema:
#    - Abra o Painel de Controle > Sistema > Configurações avançadas do sistema
#    - Clique em 'Variáveis de Ambiente' > 'Path' > 'Editar'
#    - Adicione: C:\SteamCMD
# 4. No PowerShell ou CMD, navegue até a pasta e execute:
#       steamcmd.exe +quit
#    para validar a instalação.
import subprocess
import logging
import time
import argparse
import os
import sys
import shutil
from datetime import datetime


from dotenv import load_dotenv
from firebase_admin import credentials, initialize_app, db

dotenv_path = os.path.join(os.path.dirname(__file__), "Keys", "keys.env")
load_dotenv(dotenv_path=dotenv_path)

firebase_json_path = os.getenv("firebase_json_path")
firebase_db_url = os.getenv("firebase_db_url")

# --- Initialize Firebase ---
cred = credentials.Certificate(firebase_json_path)
appcompany = initialize_app(cred, {
    'databaseURL': firebase_db_url
}, name="appcompany2")
# Firebase metrics reference
metrics_ref = db.reference('metrics', app=appcompany)


# -------------------------
# Configuration & Logging
# -------------------------


def setup_logging(log_file: str):
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )

# -------------------------
# SteamCMD Functions
# -------------------------

def run_steamcmd(steamcmd_path: str, username: str, password: str, commands: list[str], timeout: int = 300) -> bool:
    exe = steamcmd_path if steamcmd_path else 'steamcmd'
    if sys.platform.startswith('win') and not exe.lower().endswith('.exe'):
        exe += '.exe'
    cmd = [exe, '+login', username, password]
    cmd += sum(([f'+{c}'] for c in commands), []) + ['+quit']
    try:
        logging.info(f"Running: {' '.join(cmd)}")
        res = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=timeout)
        logging.info(res.stdout)
        return True
    except subprocess.TimeoutExpired:
        logging.error(f"SteamCMD timeout after {timeout}s")
        return False
    except subprocess.CalledProcessError as e:
        logging.error(f"SteamCMD error: {e.stderr}")
        return False


def steam_cycle(cycle_id, install_dir, steamcmd_path, username, password, app_id):
    logging.info(f"Steam cycle {cycle_id} start")
    # uninstall
    if os.path.isdir(install_dir):
        try:
            shutil.rmtree(install_dir)
            logging.info("Uninstalled previous install")
        except Exception as e:
            logging.warning(f"Error uninstalling: {e}")
    # download
    ok = run_steamcmd(
        steamcmd_path, username, password,
        [f"force_install_dir {install_dir}", f"app_update {app_id} validate"]
    )
    logging.info(f"Steam cycle {cycle_id} {'success' if ok else 'failure'}")
    return ok

# -------------------------
# yt-dlp Function
# -------------------------

def yt_cycle(video_url: str, out_dir: str, timeout: int = 600) -> bool:

    try:
        shutil.rmtree(out_dir)
        logging.info("Uninstalled previous install")
    except Exception as e:
        logging.warning(f"Error uninstalling: {e}")
        
    try:
        os.makedirs(out_dir, exist_ok=True)
    except Exception as e:
        logging.warning(f"Error out_dir: {e}")
        
    # Remove explicit format selection to allow default best available
    cmd = [
        'yt-dlp',
        '-o', os.path.join(out_dir, '%(title)s.%(ext)s'),
        video_url
    ]
    try:
        logging.info(f"Running: {' '.join(cmd)}")
        res = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=timeout)
        logging.info(res.stdout)
        return True
    except subprocess.TimeoutExpired:
        logging.error(f"yt-dlp timeout after {timeout}s")
        return False
    except subprocess.CalledProcessError as e:
        # Attempt fallback: list formats, then download highest quality audio+video
        logging.warning("Attempting fallback format selection...")
        list_cmd = ['yt-dlp', '--list-formats', video_url]
        try:
            formats = subprocess.check_output(list_cmd, text=True)
            logging.info(f"Available formats:\n{formats}")
        except Exception:
            pass
        # Fallback to bestvideo+bestaudio
        fallback_cmd = [
            'yt-dlp',
            '-f', 'bestvideo+bestaudio',
            '-o', os.path.join(out_dir, '%(title)s.%(ext)s'),
            video_url
        ]
        try:
            logging.info(f"Running fallback: {' '.join(fallback_cmd)}")
            res = subprocess.run(fallback_cmd, capture_output=True, text=True, check=True, timeout=timeout)
            logging.info(res.stdout)
            return True
        except Exception as e2:
            logging.error(f"Fallback failed: {e2}")
            return False


# -------------------------
# Main Loop
# -------------------------

if __name__ == '__main__':
    USERNAME = os.getenv('STEAM_USERNAME')
    PASSWORD = os.getenv('STEAM_PASSWORD')
    APP_ID = os.getenv('STEAM_APP_ID', '480')
    INSTALL_DIR = os.getenv('STEAM_INSTALL_DIR', '/steam_apps/480')
    VIDEO_FILE = os.getenv('VIDEO_FILE', 'yts.txt')
    YT_OUTPUT = os.getenv('YT_OUTPUT', 'yt_downloads')
    STEAMCMD_PATH = os.getenv('STEAMCMD_PATH', '')
    INTERVAL = int(os.getenv('CYCLE_INTERVAL', '1800'))
    LOG_FILE = os.getenv('LOG_FILE', 'automation.log')

    setup_logging(LOG_FILE)
    os.makedirs(YT_OUTPUT, exist_ok=True)

    # Load video URLs
    with open(VIDEO_FILE) as f:
        videos = [line.strip() for line in f if line.strip()]
    if not videos:
        logging.error("No videos provided; exiting.")
        sys.exit(1)

    cycle = 0
    while True:
        cycle += 1
        logging.info(f"=== Starting combined round {cycle} ===")

        # 3 Steam cycles
        for i in range(1, 4):
            ok = steam_cycle(i, INSTALL_DIR, STEAMCMD_PATH, USERNAME, PASSWORD, APP_ID)
            # Record metric for Steam cycle
            try:
                metrics_ref.push({
                    'round': cycle,
                    'type': 'steam',
                    'cycle_id': i,
                    'status': 'success' if ok else 'failure',
                    'timestamp': datetime.utcnow().isoformat()
                })
            except Exception as e:
                logging.warning(f"Error pushing steam metric: {e}")
            # time.sleep(INTERVAL)

        # 3 yt-dlp cycles
        for idx, url in enumerate(videos[:3], start=1):
            success = yt_cycle(url, YT_OUTPUT)
            logging.info(f"yt cycle {idx} {'success' if success else 'failure'}")
            # Record metric for yt-dlp cycle
            try:
                metrics_ref.push({
                    'round': cycle,
                    'type': 'yt-dlp',
                    'cycle_id': idx,
                    'video_url': url,
                    'status': 'success' if success else 'failure',
                    'timestamp': datetime.utcnow().isoformat()
                })
            except Exception as e:
                logging.warning(f"Error pushing yt-dlp metric: {e}")
            # time.sleep(INTERVAL)

        logging.info(f"=== Completed round {cycle}; ===")
        # time.sleep(interval)


# -----------------------------------------
# Exemplo de execução no Linux/macOS
# -----------------------------------------
# Salve este script como 'automation.py' e torne-o executável:
#   chmod +x automation.py
#
# Comando de exemplo (no Linux/macOS):
#   ./automation.py \
#     --username meu_usuario \
#     --password minha_senha \
#     --app-id 480 \
#     --install-dir /home/user/steam_apps/480 \
#     --interval 1800 \
#     --log-file /var/log/steam_automation.log
#
# Saída esperada:
#   2025-05-11 10:00:00 - INFO - Iniciando ciclo de automação SteamCMD
#   2025-05-11 10:00:00 - INFO - Executando: steamcmd +login meu_usuario minha_senha +force_install_dir /home/user/steam_apps/480 +app_update 480 validate +quit
#   ... (detalhes do download/app_update) ...
#   2025-05-11 10:02:30 - INFO - Download/app_update executado com sucesso.
#   2025-05-11 10:02:30 - INFO - Aguardando 1800 segundos até o próximo ciclo...

# -----------------------------------------
# Exemplo de execução no Windows (PowerShell)
# -----------------------------------------
# Abra o PowerShell, navegue até a pasta do script e execute:
#   python .\automation.py `
#     --username meu_usuario `
#     --password minha_senha `
#     --app-id 480 `
#     --install-dir C:\\SteamApps\\480 `
#     --interval 1800 `
#     --log-file C:\\Logs\\steam_automation.log
#
# Saída esperada no console e em 'C:\Logs\steam_automation.log':
#   2025-05-11 10:00:00 - INFO - Iniciando ciclo de automação SteamCMD
#   2025-05-11 10:00:00 - INFO - Executando: steamcmd +login meu_usuario minha_senha +force_install_dir C:\SteamApps\480 +app_update 480 validate +quit
#   ... (detalhes do download/app_update) ...
#   2025-05-11 10:02:30 - INFO - Download/app_update executado com sucesso.
#   2025-05-11 10:02:30 - INFO - Aguardando 1800 segundos até o próximo ciclo...


# 