from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from ..models import Orders, OrderItems, Products, Clients, MonthlyRevenue, Users
from ..extensions import db
from ..schemas import OrderSchema, OrderItemSchema
from datetime import datetime, timezone
from decimal import Decimal

# blueprint for handling order-related routes
bp = Blueprint('orders', __name__)

# route to get all orders for the current user
@bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()

    orders = Orders.query.filter_by(user_id=current_user).all()

    # serializes product data and returns as JSON
    order_schema = OrderSchema(many=True)
    result = order_schema.dump(orders)
    return jsonify(result)

# route to make a new order
@bp.route('/orders/new-order', methods=['POST'])
@jwt_required()
def new_order():
    current_user = get_jwt_identity()
    order_data = request.json

    client_id = order_data.get('client_id') # extract client ID from order data

    client = Clients.query.get(client_id) # retrieve the client object

    # check if the client exists
    if not client:
        return jsonify({"error": "Client not found"}), 404

    order = Orders(
        user_id=current_user,
        client_id=client_id,
        status=order_data.get('status', 'pending') # default status is 'pending'
    )

    total_price = 0 # initialize total price for the order
    for item_data in order_data.get('items', []): # iterate over items in the order
        product = Products.query.get(item_data['product_id']) # retrieve the product
        if not product:
            return jsonify({'error': f'Product not found'}), 404 # check if product exists
        
        if not item_data['quantity']:
            return jsonify(message="Quantity is required"), 400

        # create an order item
        item = OrderItems(
            user_id=current_user,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
        )

        total_price += item.quantity * product.price # calculate total price for the order
        order.items.append(item) # add item to the order

    order.total_price = total_price # set the total price for the order

    if not order.items:
        return jsonify(message="The order must have at least one item"), 400

    db.session.add(order)
    db.session.commit()

    order_schema = OrderSchema()
    return jsonify(order_schema.dump(order)), 201

# route to get or update a specific order by ID
@bp.route('/orders/details/<int:order_id>', methods=['GET', 'PUT'])
@jwt_required()
def update_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    if not order:
        return jsonify(message="Order not found"), 404

    # handles the GET method to retrieve order details
    if request.method == 'GET':
        order_data = {
            "client_id": order.client_id,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": Products.query.get(item.product_id).price if Products.query.get(item.product_id) else 0,
                    "product_name": Products.query.get(item.product_id).name if Products.query.get(item.product_id) else "Unknown",
                    "product_size": Products.query.get(item.product_id).size if Products.query.get(item.product_id) else "Unknown",
                    "total": Products.query.get(item.product_id).price * item.quantity if Products.query.get(item.product_id) else 0,
                } for item in order.items
            ],
            "total_price": order.total_price
        }
        return jsonify(order_data), 200

    # handles the PUT method to update order details
    data = request.get_json()

    # update order details with new data
    order.client_id = data.get('client_id', order.client_id)

    # clear existing order items
    db.session.query(OrderItems).filter_by(order_id=order.order_id).delete()

    total_price = 0 # initialize total price for the updated order
    for item_data in data.get('items', []): # iterate over new items
        product = Products.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Product not found'}), 404
        
        if not item_data['quantity']:
            return jsonify(message="Quantity is required"), 400

        # create a new order item
        item = OrderItems(
            user_id=current_user,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
        )
        
        total_price += item.quantity * product.price # calculate total price
        order.items.append(item) # add item to the order
    
    order.total_price = total_price # set the updated total price

    if not order.items:
        return jsonify(message="The order must have at least one item"), 400

    db.session.commit()

    return jsonify(message="Order updated successfully"), 200

# route to delete a specific order by ID
@bp.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    # check if there's a corresponding MonthlyRevenue record for this order
    monthly_revenue = MonthlyRevenue.query.filter_by(order_id=order_id).first()
    if monthly_revenue:
        # remove the revenue record
        db.session.delete(monthly_revenue)
    
    # delete order items associated with the order
    order_items = OrderItems.query.filter_by(order_id=order_id, user_id=current_user).all()
    for item in order_items:
        db.session.delete(item) # delete each order item

    # delete the order
    db.session.delete(order)
    db.session.commit()

    return jsonify(message="Order deleted successfully"), 200

# route to update the status of a specific order
@bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        current_user = get_jwt_identity()

        order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        # get new status
        data = request.json
        new_status = data.get('status')

        # validate new status
        if new_status not in ['pending', 'completed', 'shipped']:
            return jsonify({"error": "Invalid status"}), 400

        # store the old status of the order
        old_status = order.status

        # update the order's status with the new status
        order.status = new_status
        db.session.commit()

        # get the current date and month
        now = datetime.now(timezone.utc)
        current_year = now.year
        current_month = now.month

        # if the old status was 'completed', adjust the monthly revenue
        if old_status == 'completed' and new_status != 'completed':
            completed_order_revenue = (
                db.session.query(db.func.coalesce(db.func.sum(Products.price * OrderItems.quantity), 0))
                .select_from(OrderItems)
                .join(Products)
                .join(Orders)
                .filter(Orders.order_id == order_id)
            ).scalar() # calculate the revenue from the completed order

            # check if there is already a revenue record for this order
            existing_revenue = MonthlyRevenue.query.filter_by(user_id=current_user, order_id=order_id).first()
            if existing_revenue:
                existing_revenue.revenue -= Decimal(completed_order_revenue)  # subtract the revenue from the completed order
                if existing_revenue.revenue < 0:
                    existing_revenue.revenue = Decimal(0)  # ensure the revenue does not go negative
            else:
                return jsonify({"error": "Revenue record not found."}), 404

        # check if both old and new statuses are 'completed', and do nothing if they are
        if old_status == 'completed' and new_status == 'completed':
            return jsonify({"message": "No changes needed, status remains 'completed'."}), 200

        # if the new status is 'completed', adjust the monthly revenue
        if new_status == 'completed' and old_status != 'completed':
            completed_order_revenue = (
                db.session.query(db.func.coalesce(db.func.sum(Products.price * OrderItems.quantity), 0))
                .select_from(OrderItems)
                .join(Products)
                .join(Orders)
                .filter(Orders.order_id == order_id)
            ).scalar() # calculate the revenue from the order being completed

            # check if there is already a revenue record for the current month
            existing_revenue = MonthlyRevenue.query.filter_by(user_id=current_user, year=current_year, month=current_month).first()
            if existing_revenue:
                existing_revenue.revenue += Decimal(completed_order_revenue)  # add the revenue from the completed order
                existing_revenue.order_id = order_id  # add order id to the revenue
            else:
                # create a new revenue record for the current month if it doesn't exist
                new_revenue = MonthlyRevenue(user_id=current_user, order_id=order_id, year=current_year, month=current_month, revenue=Decimal(completed_order_revenue))
                db.session.add(new_revenue)

        db.session.commit()  # save changes to the database

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

    # rollback any changes in case of an error
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# route to print data of specific order
@bp.route('/orders/<int:order_id>/print', methods=['GET'])
@jwt_required()
def print_order(order_id):
    current_user = get_jwt_identity()

    order = Orders.query.filter_by(order_id=order_id, user_id=current_user).first()

    # serializes product data and returns as JSON
    order_schema = OrderSchema()
    result = order_schema.dump(order)
    return jsonify(result)