from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Users
from ..extensions import db
import re

bp = Blueprint('profile', __name__)

@bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()

    user = Users.query.filter_by(user_id=current_user).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    return jsonify({
        'user_id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone_number': user.phone_number
    })

@bp.route('/edit-profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    try:
        current_user = get_jwt_identity()
        
        data = request.get_json()

        new_name = data.get('name')
        new_email = data.get('email')
        new_phone_number = data.get('phone_number')

        user = Users.query.filter_by(user_id=current_user).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, new_email):
            return jsonify(message="Invalid email address"), 400
        
        if new_email and Users.query.filter_by(email=new_email).filter(Users.user_id != current_user).first():
            return jsonify(message="Email already registered"), 400

        if new_name:
            user.name = new_name
        if new_email:
            user.email = new_email
        if new_phone_number:
            user.phone_number = new_phone_number

        if not user.name or not user.email:
            return jsonify(message="Name and email are required"), 400

        db.session.commit()

        return jsonify({'message': 'Profile updated successfully'}), 200
    
    except Exception as e:
            print(f"Error: {str(e)}")
            return jsonify({'message': 'An internal error occurred'}), 500
    
@bp.route('/profile/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = get_jwt_identity()

    if current_user != user_id:
        return jsonify(message="You are not authorized to delete this account"), 403

    user = Users.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify(message="User not found"), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify(message="Account deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(message="An error occurred while deleting the account", error=str(e)), 500