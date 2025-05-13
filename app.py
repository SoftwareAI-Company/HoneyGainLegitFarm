import os
import threading
import time
import datetime
import logging
from argparse import Namespace

from flask import Flask, jsonify, render_template

import automation

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
},name="appcompany")

# Metrics for dashboard
metrics = {
    'rounds': 0,
    'last_run': None
}

# Load configuration from environment
USERNAME = os.getenv('STEAM_USERNAME')
PASSWORD = os.getenv('STEAM_PASSWORD')
APP_ID = os.getenv('STEAM_APP_ID', '480')
INSTALL_DIR = os.getenv('STEAM_INSTALL_DIR', '/steam_apps/480')
VIDEO_FILE = os.getenv('YT_VIDEO_FILE', 'yts.txt')
YT_OUTPUT = os.getenv('YT_OUTPUT', 'yt_downloads')
STEAMCMD_PATH = os.getenv('STEAMCMD_PATH', '')
INTERVAL = int(os.getenv('CYCLE_INTERVAL', '1'))
LOG_FILE = os.getenv('LOG_FILE', 'automation.log')

# Validate required variables
if not USERNAME or not PASSWORD:
    raise ValueError("Environment variables STEAM_USERNAME and STEAM_PASSWORD must be set")

# Initialize logging
automation.setup_logging(LOG_FILE)

# Prepare arguments for automation
args = Namespace(
    username=USERNAME,
    password=PASSWORD,
    app_id=APP_ID,
    install_dir=INSTALL_DIR,
    video_file=VIDEO_FILE,
    yt_output=YT_OUTPUT,
    steamcmd_path=STEAMCMD_PATH,
    log_file=LOG_FILE,
    interval=INTERVAL
)

# Ensure output directory exists
os.makedirs(YT_OUTPUT, exist_ok=True)

# Load video URLs
if not os.path.isfile(VIDEO_FILE):
    logging.error(f"Video file not found: {VIDEO_FILE}")
    raise FileNotFoundError(f"Video file not found: {VIDEO_FILE}")
with open(VIDEO_FILE) as f:
    videos = [line.strip() for line in f if line.strip()]
if not videos:
    logging.error("No video URLs found in video file")
    raise ValueError("No video URLs found in video file")

def automation_loop():
    """
    Background loop executing Steam and YouTube cycles, updating metrics.
    """
    round_id = 0
    while True:
        round_id += 1
        logging.info(f"=== Starting automation round {round_id} ===")

        # Steam cycles
        for i in range(1, 4):
            automation.steam_cycle(args, i)

        # YouTube cycles
        for idx, url in enumerate(videos[:3], start=1):
            automation.yt_cycle(url, args.yt_output)

        # Update metrics
        metrics['rounds'] = round_id
        metrics['last_run'] = datetime.datetime.utcnow().isoformat() + 'Z'

        logging.info(f"=== Completed automation round {round_id} ===")
        time.sleep(INTERVAL)

# Start automation in a daemon thread
thread = threading.Thread(target=automation_loop, daemon=True)
thread.start()

# Flask application for dashboard
app = Flask(__name__, template_folder='templates')

@app.route('/api/metrics')
def get_metrics():
    return jsonify(metrics)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)