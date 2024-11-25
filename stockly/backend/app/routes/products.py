from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Products, OrderItems
from ..extensions import db
from ..schemas import ProductSchema

# blueprint for product-related routes
bp = Blueprint('products', __name__)

# route to access products
@bp.route('/products', methods=['GET'])
@jwt_required() # requires authentication 
def products():
    current_user = get_jwt_identity()

    # fetches all products for the current user
    products = Products.query.filter_by(user_id=current_user).all()

    # serializes product data and returns as JSON
    product_schema = ProductSchema(many=True)
    result = product_schema.dump(products)
    return jsonify(result)
    
# route to register a new product
@bp.route('/products/register-product', methods=['POST'])
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

    # checks required fields
    if name is None or price is None or quantity is None:
        return jsonify(message="Product name, price, and quantity are required"), 400

    db.session.commit()

    #adds and commits the new product to the database
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

# route to retrieve or updates product details
@bp.route('/products/details/<int:product_id>', methods=['GET', 'PUT'])
@jwt_required()
def update_product(product_id):
    current_user = get_jwt_identity()

    product = Products.query.filter_by(product_id=product_id, user_id=current_user).first()

    if not product:
        return jsonify(message="Product not found"), 404

    # handles the GET method to retrieve product details
    if request.method == 'GET':
        product_data = {
            "name": product.name,
            "color": product.color,
            "size": product.size,
            "dimensions": product.dimensions,
            "price": product.price,
            "description": product.description,
            "quantity": product.quantity
        }
        return jsonify(product_data), 200

    # handles the PUT method to update product details
    data = request.get_json()

    product.name = data.get('name', product.name)
    product.color = data.get('color', product.color)
    product.size = data.get('size', product.size)
    product.dimensions = data.get('dimensions', product.dimensions)
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    product.quantity = data.get('quantity', product.quantity)

    if product.name is None or product.price is None or product.quantity is None:
        return jsonify(message="Product name, price, and quantity are required"), 400

    db.session.commit()

    return jsonify(message="Product updated successfully"), 200

# route to delete a specified product
@bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user = get_jwt_identity()

    product = Products.query.filter_by(product_id=product_id, user_id=current_user).first()
    
    if not product:
        return jsonify(message="Product not found"), 404

    try:
        db.session.delete(product)
        db.session.commit()
    except Exception as e:
        # rolls back the transaction if deletion fails
        db.session.rollback()
        return jsonify(message=f"An error occurred: {str(e)}"), 500

    return jsonify(message="Product deleted successfully"), 200