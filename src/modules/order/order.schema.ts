import { Schema } from 'mongoose';

export const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shipper_id: { type: Schema.Types.ObjectId, ref: 'User' }, // nếu có
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  products: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      addons: [
        {
          addon_id: { type: Schema.Types.ObjectId, ref: 'Addon' },
          quantity: Number,
        },
      ],
    },
  ],
});
