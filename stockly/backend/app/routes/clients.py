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

    if not name:
        return jsonify(message="Please enter the client's name")

    new_client = Clients(
        user_id=current_user,
        name=name,
        phone_number=phone_number,
        email=email,
    )
    db.session.add(new_client)
    db.session.commit()

    return jsonify(message="The client has been registered"), 201

@bp.route('/clients/details/<int:client_id>', methods=['GET', 'PUT'])
@jwt_required()
def update_client(client_id):
    current_user = get_jwt_identity()

    client = Clients.query.filter_by(client_id=client_id, user_id=current_user).first()

    if not client:
        return jsonify(message="Client not found"), 404

    if request.method == 'GET':
        client_data = {
            "name": client.name,
            "phone_number": client.phone_number,
            "email": client.email
        }
        return jsonify(client_data), 200

    data = request.get_json()

    client.name = data.get('name', client.name)
    client.phone_number = data.get('phone_number', client.phone_number)
    client.email = data.get('email', client.email)

    if not client.name:
        return jsonify(message="Please enter the client's name"), 400

    db.session.commit()

    return jsonify(message="Client details updated successfully"), 200

@bp.route('/clients/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    current_user = get_jwt_identity()

    client = Clients.query.filter_by(client_id=client_id, user_id=current_user).first()

    db.session.delete(client)
    db.session.commit()

    return jsonify(message="Client deleted successfully"), 200