from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

# initialize the JWT manager for handling JSON Web Tokens
jwt = JWTManager()

# initialize the SQLAlchemy database connection and ORM
db = SQLAlchemy()

# initialize the Bcrypt object for password hashing
bcrypt = Bcrypt()

# initialize the Migrate object for handling database migrations
migrate = Migrate()