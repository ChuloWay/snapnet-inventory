
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};



export const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
};
