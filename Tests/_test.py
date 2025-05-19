from requests import get, post, put, delete, patch
from datetime import datetime
from time import sleep
import os
from dotenv import load_dotenv
from firebase_admin import credentials, initialize_app, db

dotenv_path = os.path.join(os.path.dirname(__file__), '../', "Keys", "keys.env")
load_dotenv(dotenv_path=dotenv_path)

HONEYGAIN_EMAIL = os.getenv("HONEYGAIN_EMAIL")
HONEYGAIN_PASS = os.getenv("HONEYGAIN_PASS")


#from . import exceptions
def gen_authcode(email:str, password:str):
    """Requests an authorization token used in the header from Honeygain"""
    requestdata = post(
        "https://dashboard.honeygain.com/api/v1/users/tokens",
        json={
            'email': email,
            'password': password
        }
    ).json()['data']
    return requestdata


def fetch_aboutme(authtoken:str):
    """Fetches information about the current user."""
    requestdata = get(
        "https://dashboard.honeygain.com/api/v1/users/me",
        headers={'authorization': ("Bearer " + authtoken)}
    ).json()['data']
    requestdata['created_at'] = datetime.strptime(requestdata['created_at'].replace('+00:00', 'Z'), "%Y-%m-%dT%H:%M:%SZ")
    return requestdata


def fetch_tosstatus(authtoken:str):
    """Fetches information about the current user's terms of service status."""
    requestdata = get(
        "https://dashboard.honeygain.com/api/v1/users/tos",
        headers={'authorization': ("Bearer " + authtoken)}
    ).json()['data']
    return requestdata


def fetch_trafficstats(authtoken:str):
    """Fetches information about traffic."""
    requestdata = get(
        "https://dashboard.honeygain.com/api/v1/dashboards/traffic_stats",
        headers={'authorization': ("Bearer " + authtoken)}
    ).json()['data']
    for entry in requestdata['traffic_stats']:
        entry['date'] = datetime.strptime(entry['date'], "%Y-%m-%d")
    return requestdata


def fetch_balances(authtoken:str):
    """Fetches information about the current user's balances."""
    requestdata = get(
        "https://dashboard.honeygain.com/api/v1/users/balances",
        headers={'authorization': ("Bearer " + authtoken)}
    ).json()['data']
    return requestdata

data = gen_authcode(HONEYGAIN_EMAIL, HONEYGAIN_PASS)
# print(data)
access_token = data["access_token"]
data = fetch_balances(access_token)
print(data)
# data = fetch_trafficstats(access_token)
# print(data)
