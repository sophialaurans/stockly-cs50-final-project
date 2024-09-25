import os
from datetime import timedelta

class Config:
    # secret key for JWT authentication, defaults to 'default_secret_key' if not set
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default_secret_key')
    
    # token expiration time set to 30 days
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    
    # URI for the SQLite database
    SQLALCHEMY_DATABASE_URI = "sqlite:///stockly.db"
    
    # disable modification tracking to save resources
    SQLALCHEMY_TRACK_MODIFICATIONS = False
