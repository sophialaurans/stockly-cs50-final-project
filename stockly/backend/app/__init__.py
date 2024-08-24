from flask import Flask
from .config import Config
from .extensions import jwt, db, bcrypt, migrate
from .routes import auth, dashboard, products, orders, clients
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    jwt.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    
    app.register_blueprint(auth.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(orders.bp)
    app.register_blueprint(clients.bp)
    
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response
    
    return app
