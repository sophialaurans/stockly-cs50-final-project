from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from ..models import Orders, OrderItems, Products, Clients, MonthlyRevenue, Users
from ..extensions import db
from ..schemas import OrderSchema, OrderItemSchema
from datetime import datetime
from decimal import Decimal

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

    user = Users.query.filter_by(user_id=current_user).first()

    if not client:
        return jsonify({"error": "Client not found"}), 404

    order = Orders(
        user_id=current_user,
        client_id=client_id,
        status=order_data.get('status', 'pending')
    )

    total_price = 0
    for item_data in order_data.get('items', []):
        product = Products.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Product not found'}), 404
        
        if not item_data['quantity']:
            return jsonify(message="Quantity is required"), 400

        item = OrderItems(
            user_id=current_user,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=product.price,
        )

        total_price += item.quantity * item.price
        order.items.append(item)

    order.total_price = total_price

    if not order.items:
        return jsonify(message="The order must have at least one item"), 400

    db.session.add(order)
    db.session.commit()

    order_schema = OrderSchema()
    return jsonify(order_schema.dump(order)), 201

@bp.route('/orders/details/<int:order_id>', methods=['GET', 'PUT'])
@jwt_required()
def update_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    if not order:
        return jsonify(message="Order not found"), 404

    if request.method == 'GET':
        order_data = {
            "client_id": order.client_id,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": item.price,
                    "product_name": Products.query.get(item.product_id).name,
                    "product_size": Products.query.get(item.product_id).size,
                    "total": item.price * item.quantity,
                } for item in order.items
            ],
            "total_price": order.total_price
        }
        return jsonify(order_data), 200

    data = request.get_json()

    order.client_id = data.get('client_id', order.client_id)
    order.status = data.get('status', order.status)

    db.session.query(OrderItems).filter_by(order_id=order.order_id).delete()

    total_price = 0
    for item_data in data.get('items', []):
        product = Products.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Product not found'}), 404
        
        if not item_data['quantity']:
            return jsonify(message="Quantity is required"), 400

        item = OrderItems(
            user_id=current_user,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=product.price
        )
        
        total_price += item.quantity * item.price
        order.items.append(item)
    
    order.total_price = total_price

    if not order.items:
        return jsonify(message="The order must have at least one item"), 400

    db.session.commit()

    return jsonify(message="Order updated successfully"), 200

@bp.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    order_items = OrderItems.query.filter_by(order_id=order_id, user_id=current_user).all()
    for item in order_items:
        db.session.delete(item)

    db.session.delete(order)
    db.session.commit()

    return jsonify(message="Order deleted successfully"), 200

@bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        current_user = get_jwt_identity()

        order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        data = request.json
        new_status = data.get('status')

        if new_status not in ['pending', 'completed', 'shipped']:
            return jsonify({"error": "Invalid status"}), 400

        old_status = order.status
        order.status = new_status
        db.session.commit()

        now = datetime.utcnow()
        current_year = now.year
        current_month = now.month

        if old_status == 'completed':
            completed_order_revenue = db.session.query(db.func.coalesce(db.func.sum(OrderItems.price * OrderItems.quantity), 0)).join(Orders).filter(
                Orders.order_id == order_id
            ).scalar()

            existing_revenue = MonthlyRevenue.query.filter_by(user_id=current_user, year=current_year, month=current_month).first()
            if existing_revenue:
                existing_revenue.revenue -= Decimal(completed_order_revenue)
                if existing_revenue.revenue < 0:
                    existing_revenue.revenue = Decimal(0)
            else:
                return jsonify({"error": "Revenue record not found for current month."}), 404

        if new_status == 'completed':
            completed_order_revenue = db.session.query(db.func.coalesce(db.func.sum(OrderItems.price * OrderItems.quantity), 0)).join(Orders).filter(
                Orders.order_id == order_id
            ).scalar()

            existing_revenue = MonthlyRevenue.query.filter_by(user_id=current_user, year=current_year, month=current_month).first()
            if existing_revenue:
                existing_revenue.revenue += Decimal(completed_order_revenue)
            else:
                new_revenue = MonthlyRevenue(user_id=current_user, year=current_year, month=current_month, revenue=Decimal(completed_order_revenue))
                db.session.add(new_revenue)

        db.session.commit()

        return jsonify({
            "message": "Order status updated successfully",
            "order": {
                "order_id": order.order_id,
                "client_id": order.client.client_id,
                "total_price": order.total_price,
                "date": order.date,
                "status": order.status
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@bp.route('/orders/<int:order_id>/print', methods=['GET'])
@jwt_required()
def print_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    order_schema = OrderSchema()
    result = order_schema.dump(order)

    return jsonify(result)