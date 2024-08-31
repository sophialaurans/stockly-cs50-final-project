from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from ..models import Orders, OrderItems, Products, Clients
from ..extensions import db
from ..schemas import OrderSchema, OrderItemSchema

bp = Blueprint('orders', __name__)

@bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()

    orders = Orders.query.filter_by(user_id=current_user).all()

    order_schema = OrderSchema(many=True)
    result = order_schema.dump(orders)

    return jsonify(result)

@bp.route('/new-order', methods=['POST'])
@jwt_required()
def new_order():
    current_user = get_jwt_identity()
    order_data = request.json

    client_id = order_data.get('client_id')

    client = Clients.query.get(client_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    order = Orders(
        user_id=current_user,
        client_id=client_id,
        client_name=client.name,
        status=order_data.get('status', 'pending')
    )

    total_price = 0
    for item_data in order_data.get('items', []):
        product = Products.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Product with ID {item_data["product_id"]} not found'}), 404

        item = OrderItems(
            user_id=current_user,
            product_id=item_data['product_id'],
            product_name=product.name,
            product_size=product.size,
            product_color=product.color,
            quantity=item_data['quantity'],
            price=product.price,
        )

        total_price += item.quantity * item.price
        order.items.append(item)

    order.total_price = total_price

    db.session.add(order)
    db.session.commit()

    order_schema = OrderSchema()
    return jsonify(order_schema.dump(order)), 201

@bp.route('/orders/details/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    if not order:
        return jsonify(message="Order not found"), 404

    data = request.get_json()

    order.client_id = data.get('client_id', order.client_id)
    order.status = data.get('status', order.status)

    db.session.query(OrderItems).filter_by(order_id=order.order_id).delete()

    total_price = 0
    for item_data in data.get('items', []):
        product = Products.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Product with ID {item_data["product_id"]} not found'}), 404

        item = OrderItems(
            user_id=current_user,
            product_id=item_data['product_id'],
            product_name=product.name,
            product_size=product.size,
            quantity=item_data['quantity'],
            price=product.price
        )
        
        total_price += item.quantity * item.price
        order.items.append(item)
    
    order.total_price = total_price

    db.session.commit()

    return jsonify(message="Order updated successfully"), 200

@bp.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    db.session.delete(order)
    db.session.commit()

    return jsonify(message="Order deleted successfully"), 200

@bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.json
    new_status = data.get('status')

    if new_status not in ['pending', 'completed', 'shipped']:
        return jsonify({"error": "Invalid status"}), 400

    order.status = new_status
    db.session.commit()

    return jsonify({"message": "Order status updated successfully", "order": {
        "order_id": order.order_id,
        "client_name": order.client_name,
        "total_price": order.total_price,
        "date": order.date,
        "status": order.status
    }}), 200