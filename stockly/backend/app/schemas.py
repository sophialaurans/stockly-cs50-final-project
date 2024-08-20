from marshmallow import Schema, fields

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    size = fields.Str()
    color = fields.Str()
    price = fields.Float(required=True)
    quantity = fields.Int(required=True)