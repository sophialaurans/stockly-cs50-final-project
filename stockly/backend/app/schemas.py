from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from .models import Orders, OrderItems, Products

class ProductSchema(Schema):
    product_id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    size = fields.Str()
    color = fields.Str()
    price = fields.Float(required=True)
    quantity = fields.Int(required=True)

class ClientSchema(Schema):
    client_id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    phone_number = fields.Int()
    email = fields.Str()

class OrderItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = OrderItems
        include_relationships = True
        load_instance = True

    order_id = fields.Int(dump_only=True)
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    price = fields.Float(dump_only=True)

class OrderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Orders
        include_relationships = True
        load_instance = True

    user_id = fields.Int(required=True)
    client_id = fields.Int(required=True)
    date = fields.DateTime(dump_only=True)
    status = fields.Str(validate=validate.OneOf(['pending', 'completed', 'shipped']))
    items = fields.List(fields.Nested(OrderItemSchema), many=True)
    total_price = fields.Float(dump_only=True)
