import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Product";

export interface IInventory extends Document {
  producto: IProduct['_id'];
  cantidad: number;
  ubicacion: string;
  movimiento: 'entrada' | 'salida';
  motivo: string;
  usuario: mongoose.Types.ObjectId;
}

const InventorySchema: Schema = new Schema(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    ubicacion: {
      type: String,
      required: true,
      trim: true,
    },
    movimiento: {
      type: String,
      enum: ['entrada', 'salida'],
      required: true,
    },
    motivo: {
      type: String,
      required: true,
      trim: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

InventorySchema.pre<IInventory>(/^find/, function (next) {
  this.populate('producto', 'nombre sku');
  this.populate('usuario', 'name email');
  next();
});

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
export default Inventory;