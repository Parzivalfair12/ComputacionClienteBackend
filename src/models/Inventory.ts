import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Product";

export interface IInventory extends Document {
  product: IProduct['_id'];
  amount: number;
  location: string;
  movement: 'entrada' | 'salida';
  reason: string;
  user: mongoose.Types.ObjectId;
}

const InventorySchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    movement: {
      type: String,
      enum: ['entrada', 'salida'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
    strictPopulate: false
  }
);

InventorySchema.pre<IInventory>(/^find/, function (next) {
  this.populate('producto', 'nombre sku');
  this.populate('usuario', 'name email');
  next();
});

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
export default Inventory;