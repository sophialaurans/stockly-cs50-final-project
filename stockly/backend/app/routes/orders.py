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

@bp.route('/place-an-order', methods=['POST'])
@jwt_required()
def create_order():
    try:
        order_data = request.json
        order_schema = OrderSchema()
        order = order_schema.load(order_data, session=db.session)
        
        total_price = 0
        for item_data in order_data.get('items', []):
            item_schema = OrderItemSchema()
            item = item_schema.load(item_data, session=db.session)
            product = Products.query.get(item.product_id)
            if not product:
                return jsonify({'error': f'Product with ID {item.product_id} not found'}), 404

            item.price = product.price
            total_price += item.quantity * item.price

            order.items.append(item)
        
        order.total_price = total_price

        db.session.add(order)
        db.session.commit()

        return jsonify(order_schema.dump(order)), 201

    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
