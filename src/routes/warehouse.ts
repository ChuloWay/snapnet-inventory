import express, { Request, Response, NextFunction } from "express";
import Warehouse from "../models/warehouse";
import authenticateJWT from "../middlewares/isAuthenticated";
import { authorizeRoles } from "../middlewares/authorize";
import validate from "../middlewares/validateReq";

import {
  createWarehouseSchema,
  updateWarehouseSchema,
} from "../utils/validationSchemas";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", async (req: Request, res: Response) => {
  try {
    const warehouses = await Warehouse.findAll();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve warehouses" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const warehouse = await Warehouse.findByPk(id);

    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve warehouse" });
  }
});

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  validate(createWarehouseSchema),
  async (req: Request, res: Response) => {
    const { name, location } = req.body;

    try {
      const warehouse = await Warehouse.create({ name, location });
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(500).json({ error: "Failed to create warehouse" });
    }
  }
);

router.put(
  "/:id",
  authorizeRoles(["admin", "manager"]),
  validate(updateWarehouseSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, location } = req.body;

    try {
      const warehouse = await Warehouse.findByPk(id);

      if (!warehouse) {
        return res.status(404).json({ error: "Warehouse not found" });
      }

      await warehouse.update({ name, location });
      res.status(200).json(warehouse);
    } catch (error) {
      res.status(500).json({ error: "Failed to update warehouse" });
    }
  }
);

router.delete(
  "/:id",
  authorizeRoles(["admin", "manager"]),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const warehouse = await Warehouse.findByPk(id);

      if (!warehouse) {
        return res.status(404).json({ error: "Warehouse not found" });
      }

      await warehouse.destroy();
      res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete warehouse" });
    }
  }
);

export default router;
