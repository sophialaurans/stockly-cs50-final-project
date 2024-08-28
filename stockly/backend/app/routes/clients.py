from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Clients
from ..extensions import db
from ..schemas import ClientSchema

bp = Blueprint('clients', __name__)

@bp.route('/clients', methods=['GET'])
@jwt_required()
def clients():
    current_user = get_jwt_identity()

    clients = Clients.query.filter_by(user_id=current_user).all()

    client_schema = ClientSchema(many=True)
    result = client_schema.dump(clients)

    return jsonify(result)
    
@bp.route('/register-client', methods=['POST'])
@jwt_required()
def register_client():
    current_user = get_jwt_identity()

    data = request.get_json()
    name = data['name']
    phone_number = data['phone_number']
    email = data['email']

    new_client = Clients(
        user_id=current_user,
        name=name,
        phone_number=phone_number,
        email=email,
    )
    db.session.add(new_client)
    db.session.commit()

    return jsonify(message="The client has been registered"), 201