import { z } from 'zod';

export const registerUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
  role: z.enum(['user', 'admin', 'manager']).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'manager']),
});


export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.number().positive('Price must be greater than 0'),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0').optional(),
});


export const createStockSchema = z.object({
  productId: z.number().int('Invalid product ID'),
  warehouseId: z.number().int('Invalid warehouse ID'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
});

export const updateStockSchema = z.object({
  productId: z.number().int('Invalid product ID').optional(),
  warehouseId: z.number().int('Invalid warehouse ID').optional(),
  quantity: z.number().int().positive('Quantity must be greater than 0').optional(),
});


export const createWarehouseSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required'),
  location: z.string().min(1, 'Warehouse location is required'),
});

export const updateWarehouseSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
});
