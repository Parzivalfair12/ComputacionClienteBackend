import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  confirmado: boolean;
  token: string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

//Validamos que no retorne ni el token ni la contraseña
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.token;
  return user;
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;