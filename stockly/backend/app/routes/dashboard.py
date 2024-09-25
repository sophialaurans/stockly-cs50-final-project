from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Products, Orders, Clients, OrderItems, MonthlyRevenue, Users
from ..extensions import db
from datetime import datetime
import calendar

# blueprint for dashboard routes
bp = Blueprint('dashboard', __name__)

# route to access the dashboard
@bp.route('/', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()

    # counts total products for the current user
    total_products = Products.query.filter_by(user_id=current_user).count()
    
    # calculates total stock
    total_stock = db.session.query(db.func.coalesce(db.func.sum(Products.quantity), 0)).filter_by(user_id=current_user).scalar()
    
    # counts pending orders
    pending_orders = Orders.query.filter_by(user_id=current_user, status='pending').count()
    
    # counts total clients
    total_clients = Clients.query.filter_by(user_id=current_user).count()
    
    # gets the current year and month
    current_year = datetime.utcnow().year
    current_month = datetime.utcnow().month

    # calculates revenue for the current month
    current_month_revenue = db.session.query(db.func.coalesce(MonthlyRevenue.revenue, 0)).filter_by(
        user_id=current_user,
        year=current_year,
        month=current_month
    ).scalar()

    # retrieves all revenues for the current year
    revenues = MonthlyRevenue.query.filter_by(user_id=current_user, year=current_year).all()

    # initializes a dictionary to store monthly revenues
    data_by_month = {i: 0 for i in range(1, 13)}
    for revenue in revenues:
        data_by_month[revenue.month] = float(revenue.revenue)

    # creates lists of labels and revenue data for the months
    labels = [calendar.month_abbr[month] for month in range(1, 13)]
    revenue_data = [data_by_month[month] for month in range(1, 13)]

    return jsonify({
        'totalProducts': total_products,
        'totalStock': total_stock,
        'pendingOrders': pending_orders,
        'currentMonthRevenue': current_month_revenue,
        'totalClients': total_clients,
        'labels': labels,
        'revenueData': revenue_data,
    })