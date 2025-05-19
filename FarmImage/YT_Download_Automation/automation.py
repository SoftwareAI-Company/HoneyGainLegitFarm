
import subprocess
import logging
import time
import argparse
import os
import sys
import shutil
from datetime import datetime
from dotenv import load_dotenv
from DownloadList import downloadList


dotenv_path = os.path.join(os.path.dirname(__file__), "Keys", "example.env")
load_dotenv(dotenv_path=dotenv_path)

    
def setup_logging(log_file: str):
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )

def yt_cycle(video_url: str, out_dir: str, timeout: int = 600) -> bool:

    try:
        shutil.rmtree(out_dir)
        logging.info("yt_cycle folder remove")
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

if __name__ == '__main__':
    VIDEO_FILE = os.getenv('VIDEO_FILE', 'yts.txt')
    YT_OUTPUT = os.getenv('YT_OUTPUT', 'yt_downloads')
    INTERVAL = int(os.getenv('CYCLE_INTERVAL', '1800'))
    LOG_FILE = os.getenv('LOG_FILE', 'automation.log')
    YT_RANGE  = os.getenv('YT_RANGE', '3')

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
        logging.info(f"=== yt cycle round {cycle} ===")
        for idx, url in enumerate(videos[:int(YT_RANGE)], start=1):
            success = yt_cycle(url, YT_OUTPUT)
            logging.info(f"yt cycle {idx} {'success' if success else 'failure'}")
        
        downloadList.main()
        cycle = 0
        with open(VIDEO_FILE) as f:
            videos = [line.strip() for line in f if line.strip()]

