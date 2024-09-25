from flask import Flask
from .config import Config
from .extensions import jwt, db, bcrypt, migrate
from .routes import auth, dashboard, products, orders, clients, profile
from flask_cors import CORS
from dotenv import load_dotenv
import os

# load environment variables from the .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config) # load configuration from the Config class
    
    CORS(app) # enable Cross-Origin Resource Sharing (CORS)
    
    # initialize extensions
    jwt.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    
    # register blueprints for routing
    app.register_blueprint(auth.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(orders.bp)
    app.register_blueprint(clients.bp)
    app.register_blueprint(profile.bp)
    
    # recommended by ChatGPT: Use after_request to disable caching for security reasons
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response
    
    return app
