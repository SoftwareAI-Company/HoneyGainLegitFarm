## api.py

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv
from requests import get, post, put, delete, patch

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, supports_credentials=True, origins="*")
app.secret_key = 'sua_chave_secreta' 

@app.route('/', methods=['POST'])
def route_create_user():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5420)

