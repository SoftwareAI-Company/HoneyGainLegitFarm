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


def steam_cycle(args, cycle_id):
    logging.info(f"Steam cycle {cycle_id} start")
    # uninstall
    if os.path.isdir(args.install_dir):
        try:
            shutil.rmtree(args.install_dir)
            logging.info("Uninstalled previous install")
        except Exception as e:
            logging.warning(f"Error uninstalling: {e}")
    # download
    ok = run_steamcmd(
        args.steamcmd_path, args.username, args.password,
        [f"force_install_dir {args.install_dir}", f"app_update {args.app_id} validate"]
    )
    logging.info(f"Steam cycle {cycle_id} {'success' if ok else 'failure'}")

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
    parser = argparse.ArgumentParser(description='Combined SteamCLI & yt-dlp automation')
    parser.add_argument('--username', required=True, help='Steam username')
    parser.add_argument('--password', required=True, help='Steam password')
    parser.add_argument('--app-id', required=True, help='Steam App ID')
    parser.add_argument('--install-dir', required=True, help='Steam install directory')
    parser.add_argument('--video-file', required=True, help='Path to text file with one YouTube URL per line')
    parser.add_argument('--yt-output', default='yt_downloads', help='Directory for yt-dlp downloads')
    parser.add_argument('--steamcmd-path', default='', help='Path to steamcmd executable')
    parser.add_argument('--log-file', default='automation.log', help='Log file')
    # parser.add_argument('--interval', type=int, default=60, help='Seconds to wait between cycles')
    args = parser.parse_args()

    setup_logging(args.log_file)
    os.makedirs(args.yt_output, exist_ok=True)

    # Load video URLs
    with open(args.video_file) as f:
        videos = [line.strip() for line in f if line.strip()]
    if not videos:
        logging.error("No videos provided; exiting.")
        sys.exit(1)

    cycle = 0
    while True:
        cycle += 1
        logging.info(f"=== Starting combined round {cycle} ===")

        # # 3 Steam cycles
        # for i in range(1, 4):
        #     steam_cycle(args, i)
        #     # time.sleep(args.interval)

        # 3 yt-dlp cycles
        for idx, url in enumerate(videos[:3], start=1):
            success = yt_cycle(url, args.yt_output)
            logging.info(f"yt cycle {idx} {'success' if success else 'failure'}")
            # time.sleep(args.interval)

        logging.info(f"=== Completed round {cycle}; ===")
        # time.sleep(args.interval)


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