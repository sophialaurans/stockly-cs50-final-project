from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Products
from ..extensions import db
from ..schemas import ProductSchema

bp = Blueprint('products', __name__)

@bp.route('/products', methods=['GET'])
@jwt_required()
def products():
    current_user = get_jwt_identity()

    products = Products.query.filter_by(user_id=current_user).all()

    product_schema = ProductSchema(many=True)
    result = product_schema.dump(products)

    return jsonify(result)
    
@bp.route('/register-product', methods=['POST'])
@jwt_required()
def register_product():
    current_user = get_jwt_identity()

    data = request.get_json()
    name = data['name']
    color = data['color']
    size = data['size']
    dimensions = data['dimensions']
    price = data['price']
    description = data['description']
    quantity = data['quantity']

    new_product = Products(
        user_id=current_user,
        name=name,
        color=color,
        size=size,
        dimensions=dimensions,
        price=price,
        description=description,
        quantity=quantity
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify(message="The product has been registered"), 201