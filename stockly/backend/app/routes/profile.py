from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Users
from ..extensions import db

bp = Blueprint('profile', __name__)

@bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()

    current_user_name = db.session.query(Users.name).filter_by(user_id=current_user).scalar()
    current_user_email = db.session.query(Users.email).filter_by(user_id=current_user).scalar()
    current_user_phone = db.session.query(Users.phone_number).filter_by(user_id=current_user).scalar()

    return jsonify({
        'name': current_user_name,
        'email': current_user_email,
        'phone': current_user_phone
    })

@bp.route('/edit-profile', methods=['POST'])
@jwt_required()
def edit_profile():
    current_user = get_jwt_identity()
    
    data = request.get_json()

    new_name = data.get('name')
    new_email = data.get('email')
    new_phone = data.get('phone')

    user = Users.query.filter_by(user_id=current_user).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if new_name:
        user.name = new_name
    if new_email:
        user.email = new_email
    if new_phone:
        user.phone_number = new_phone

    db.session.commit()

    return jsonify({'message': 'Profile updated successfully'}), 200
