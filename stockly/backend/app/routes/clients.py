from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Clients
from ..extensions import db
from ..schemas import ClientSchema

# define the blueprint for client routes
bp = Blueprint('clients', __name__)

# route to access clients list
@bp.route('/clients', methods=['GET'])
@jwt_required() # requires authentication
def clients():
    current_user = get_jwt_identity() # gets the current user's ID from the token

    # queries all clients linked to the current user
    clients = Clients.query.filter_by(user_id=current_user).all()

    # serializes the client data into JSON format
    client_schema = ClientSchema(many=True)
    result = client_schema.dump(clients)
    
    return jsonify(result)

# route to client registration with a POST request
@bp.route('/clients/register-client', methods=['POST'])
@jwt_required()
def register_client():
    current_user = get_jwt_identity()

    # gets the request data
    data = request.get_json()
    name = data['name']
    phone_number = data['phone_number']
    email = data['email']

    # checks if the client name is provided
    if not name:
        return jsonify(message="Please enter the client's name")

    # creates a new client record in the database
    new_client = Clients(
        user_id=current_user,
        name=name,
        phone_number=phone_number,
        email=email,
    )

    # adds and commits the new client to the database
    db.session.add(new_client)
    db.session.commit()

    return jsonify(message="The client has been registered"), 201

# route to retrieve or update a specific client's details
@bp.route('/clients/details/<int:client_id>', methods=['GET', 'PUT'])
@jwt_required()
def update_client(client_id):
    #looks for a client with the given ID that belongs to the current user
    current_user = get_jwt_identity()
    client = Clients.query.filter_by(client_id=client_id, user_id=current_user).first()

    # returns a 404 error if the client is not found
    if not client:
        return jsonify(message="Client not found"), 404

    # handles the GET method to retrieve client details
    if request.method == 'GET':
        client_data = {
            "name": client.name,
            "phone_number": client.phone_number,
            "email": client.email
        }
        return jsonify(client_data), 200

    # handles the PUT method to update client details
    data = request.get_json()

    client.name = data.get('name', client.name)
    client.phone_number = data.get('phone_number', client.phone_number)
    client.email = data.get('email', client.email)

    # ensures the client's name is provided before updating
    if not client.name:
        return jsonify(message="Please enter the client's name"), 400

    db.session.commit()

    return jsonify(message="Client details updated successfully"), 200

# route to delete client
@bp.route('/clients/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    current_user = get_jwt_identity()

    client = Clients.query.filter_by(client_id=client_id, user_id=current_user).first()
    
    if not client:
        return jsonify(message="Client not found"), 404

    try:
        db.session.delete(client)
        db.session.commit()
    except Exception as e:
        # rolls back the transaction if deletion fails
        db.session.rollback()
        return jsonify(message=f"An error occurred: {str(e)}"), 500

    return jsonify(message="Client deleted successfully"), 200