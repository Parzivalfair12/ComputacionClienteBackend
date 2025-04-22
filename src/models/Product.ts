import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  sku: string;
  status: 'activo' | 'inactivo';
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['postre', 'pan', 'galletas', 'tortas'],
    },
    image: {
      type: String,
      default: 'default-product.jpg',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo',
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.methods.toJSON = function () {
  const product = this.toObject();
  delete product.__v;
  return product;
};

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;