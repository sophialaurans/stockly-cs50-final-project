from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Users
from ..extensions import db
import re

# blueprint for user profile routes
bp = Blueprint('profile', __name__)

# route to access user profile
@bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()

    # get user's profile from the database and returns 404 error if the user is not found
    user = Users.query.filter_by(user_id=current_user).first()
    if not user:
        return jsonify(message="User not found"), 404
    
    # returns user's profile details as a JSON response
    return jsonify({
        'user_id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone_number': user.phone_number
    })

# route to edit profile information
@bp.route('/edit-profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    try:
        current_user = get_jwt_identity()
        
        # gets the new profile data from the request
        data = request.get_json()
        new_name = data.get('name', None)  # default to None if not provided
        new_email = data.get('email', None)  # default to None if not provided
        new_phone_number = data.get('phone_number', None)  # default to None if not provided

        # fetches user's profile based on their ID
        user = Users.query.filter_by(user_id=current_user).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # validates new email and checks if it is already registered
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, new_email):
            return jsonify(message="Invalid email address"), 400
        if new_email and Users.query.filter_by(email=new_email).filter(Users.user_id != current_user).first():
            return jsonify(message="Email already registered"), 400

        # updates the user's name, email, or phone number if provided
        if new_name is not None:  # update only if provided
            user.name = new_name
        if new_email is not None:  # update only if provided
            user.email = new_email
        if new_phone_number is not None:  # update only if provided
            user.phone_number = new_phone_number

        # check required fields
        if not user.name or not user.email:
            return jsonify(message="Name and email are required"), 400

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    
    except Exception as e:
            print(f"Error: {str(e)}")
            return jsonify({'message': 'An internal error occurred'}), 500
    
# route to delete user account
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
        # deletes user's account from the database
        db.session.delete(user)
        db.session.commit()
        return jsonify(message="Account deleted successfully"), 200
    except Exception as e:
        #rolls back the transaction if an error occurs while deleting
        db.session.rollback()
        return jsonify(message="An error occurred while deleting the account", error=str(e)), 500