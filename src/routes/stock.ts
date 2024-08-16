import express, { Request, Response, NextFunction } from 'express';
import Stock from '../models/stock';
import authenticateJWT from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/authorize';
import validate from "../middlewares/validateReq";

import { createStockSchema, updateStockSchema } from "../utils/validationSchemas";


const router = express.Router();

router.use(authenticateJWT);

router.get('/', async (req: Request, res: Response) => {
  try {
    const stocks = await Stock.findAll();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stocks' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findByPk(id);

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stock' });
  }
});

router.post('/', authorizeRoles(['admin', 'manager']), validate(createStockSchema), async (req: Request, res: Response) => {
  const { productId, warehouseId, quantity } = req.body;

  try {
    const stock = await Stock.create({ productId, warehouseId, quantity });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stock' });
  }
});

router.put('/:id', authorizeRoles(['admin', 'manager']), validate(updateStockSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, warehouseId, quantity } = req.body;

  try {
    const stock = await Stock.findByPk(id);

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    await stock.update({ productId, warehouseId, quantity });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

router.delete('/:id', authorizeRoles(['admin', 'manager']), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findByPk(id);

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    await stock.destroy();
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

export default router;
