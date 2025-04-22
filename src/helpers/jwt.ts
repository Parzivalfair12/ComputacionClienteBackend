import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role?: string) => {
  const secret = process.env.JWT_SECRET || 'secret_key';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '1d'
  });
};