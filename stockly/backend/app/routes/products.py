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

@bp.route('/products/details/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    current_user = get_jwt_identity()

    product = Products.query.filter_by(product_id=product_id, user_id=current_user).first()

    if not product:
        return jsonify(message="Product not found"), 404

    data = request.get_json()

    product.name = data.get('name', product.name)
    product.color = data.get('color', product.color)
    product.size = data.get('size', product.size)
    product.dimensions = data.get('dimensions', product.dimensions)
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    product.quantity = data.get('quantity', product.quantity)

    db.session.commit()

    return jsonify(message="Product updated successfully"), 200


@bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user = get_jwt_identity()

    product = Products.query.filter_by(product_id=product_id, user_id=current_user).first()

    db.session.delete(product)
    db.session.commit()

    return jsonify(message="Product deleted successfully"), 200