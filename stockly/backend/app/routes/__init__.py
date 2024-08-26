from flask import Blueprint

bp = Blueprint('main', __name__)

from . import auth, dashboard, products, orders, clients, profile
