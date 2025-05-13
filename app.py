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
# Firebase metrics reference
metrics_ref = db.reference('metrics', app=appcompany)

app = Flask(__name__, template_folder='templates')

@app.route('/api/metrics')
def get_metrics():
    return jsonify(metrics_ref.get())

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5010)