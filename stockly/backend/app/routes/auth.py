from flask import Blueprint, jsonify, request
from ..models import Users
from ..extensions import db, bcrypt
from flask_jwt_extended import create_access_token
import re

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']
    confirm_password = data['confirm_password']

    if not name or not email or not password or not confirm_password:
        return jsonify(message="All fields are required"), 400
    
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify(message="Invalid email address"), 400
    
    if Users.query.filter_by(email=email).first():
        return jsonify(message="Email already registered"), 400
    
    if password != confirm_password:
        return jsonify(message="Passwords do not match"), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = Users(name=name, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(message="The account has been created"), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify(message="Missing email or password"), 400

    email = data['email']
    password = data['password']

    user = Users.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.user_id)
        return jsonify(message="Login successful", access_token=access_token, user_id=user.user_id), 200
    
    return jsonify(message="Incorrect email or password"), 401
