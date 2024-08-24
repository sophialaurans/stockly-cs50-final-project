from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from ..models import Orders, OrderItems, Products
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
    try:
        order_data = request.json

        order = Orders(
            user_id=order_data.get('user_id'),
            client_id=order_data.get('client_id'),
            status=order_data.get('status', 'pending')
        )
        
        total_price = 0
        for item_data in order_data.get('items', []):
            product = Products.query.get(item_data['product_id'])
            if not product:
                return jsonify({'error': f'Product with ID {item_data["product_id"]} not found'}), 404

            item = OrderItems(
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=product.price,
                order=order
            )
            
            total_price += item.quantity * item.price
            order.items.append(item)
        
        order.total_price = total_price

        db.session.add(order)
        db.session.commit()

        order_schema = OrderSchema()
        return jsonify(order_schema.dump(order)), 201

    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500