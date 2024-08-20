from .extensions import db, bcrypt
from datetime import datetime

class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone_number = db.Column(db.String(50), nullable=True, unique=True)
    password_hash = db.Column(db.Text, nullable=False)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
class Products(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    name = db.Column(db.String(120), nullable=False)
    color = db.Column(db.String(50), nullable=True)
    size = db.Column(db.String(10), nullable=True)
    dimensions = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=0)

class Clients(db.Model):
    __tablename__ = 'clients'
    client_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    name = db.Column(db.String(120), nullable=True)
    phone_number = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)

class Orders(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'))
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False, default='pending')
    items = db.relationship('OrderItems', backref='order', lazy=True)
    total_price = db.Column(db.Float, nullable=False, default=0.0)

class OrderItems(db.Model):
    __tablename__ = 'order_items'
    order_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'))
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False)
