import express, { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import authenticateJWT from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/authorize';
import validate from "../middlewares/validateReq";

import { createProductSchema, updateProductSchema } from "../utils/validationSchemas";


const router = express.Router();

router.use(authenticateJWT);

router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

router.post('/', authorizeRoles(['admin', 'manager']), validate(createProductSchema), async (req: Request, res: Response) => {
  const { name, description, price } = req.body;

  try {
    const product = await Product.create({ name, description, price });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authorizeRoles(['admin', 'manager']), validate(updateProductSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({ name, description, price });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authorizeRoles(['admin', 'manager']), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
