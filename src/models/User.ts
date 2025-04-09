import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  confirmado: boolean;
  token: string;
  comparePassword(password: string): Promise<boolean>;
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

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Cuando retornemos el usuario no debe ser visible la contraseña y el token
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.token;
  return user;
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;