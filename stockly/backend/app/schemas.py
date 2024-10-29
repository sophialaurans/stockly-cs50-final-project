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
    phone_number = fields.Str()
    email = fields.Str()

class OrderItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = OrderItems
        include_relationships = True
        load_instance = True

    order_item_id = fields.Int(dump_only=True)
    order_id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    price = fields.Method("get_price", dump_only=True)
    product_name = fields.Method("get_product_name", dump_only=True)
    product_size = fields.Method("get_product_size", dump_only=True)
    product_color = fields.Method("get_product_color", dump_only=True)

    def get_price(self, obj):
        return obj.product.price if obj.product else None

    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

    def get_product_size(self, obj):
        return obj.product.size if obj.product else None

    def get_product_color(self, obj):
        return obj.product.color if obj.product else None

class OrderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Orders
        include_relationships = True
        load_instance = True

    order_id = fields.Int(dump_only=True)
    client_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    user_name = fields.Method("get_user_name", dump_only=True)
    client_name = fields.Method("get_client_name", dump_only=True)
    date = fields.DateTime(dump_only=True)
    status = fields.Str(validate=validate.OneOf(['pending', 'completed', 'shipped']))
    items = fields.List(fields.Nested(OrderItemSchema), many=True)
    total_price = fields.Float(dump_only=True)

    def get_user_name(self, obj):
        return obj.user.name if obj.user else None

    def get_client_name(self, obj):
        return obj.client.name if obj.client else None