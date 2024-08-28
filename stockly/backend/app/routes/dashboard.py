from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Products, Orders, Clients, OrderItems
from ..extensions import db
from datetime import datetime

bp = Blueprint('dashboard', __name__)

@bp.route('/', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()

    total_products = Products.query.filter_by(user_id=current_user).count()
    total_stock = db.session.query(db.func.coalesce(db.func.sum(Products.quantity), 0)).filter_by(user_id=current_user).scalar()
    pending_orders = Orders.query.filter_by(user_id=current_user, status='pending').count()
    last_month_start = datetime.utcnow().replace(day=1)
    last_month_revenue = db.session.query(db.func.coalesce(db.func.sum(OrderItems.price * OrderItems.quantity), 0)).join(Orders).filter(
        Orders.user_id == current_user,
        Orders.date >= last_month_start,
        Orders.status == 'complete'
    ).scalar()
    total_clients = Clients.query.filter_by(user_id=current_user).count()

    return jsonify({
        'totalProducts': total_products,
        'totalStock': total_stock,
        'pendingOrders': pending_orders,
        'lastMonthRevenue': last_month_revenue,
        'totalClients': total_clients,
    })
