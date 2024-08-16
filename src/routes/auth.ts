import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import authenticateJWT from "../middlewares/isAuthenticated";
import { authorizeRoles } from "../middlewares/authorize";
import validate from "../middlewares/validateReq";
import {
  registerUserSchema,
  loginUserSchema,
  updateUserRoleSchema,
} from "../utils/validationSchemas";

const router = express.Router();

router.post(
  "/register",
  validate(registerUserSchema),
  async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
      
      res.status(200).json({
        statusCode: 201,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

router.post(
  "/login",
  validate(loginUserSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        statusCode: 200,
        message: "User Login successful",
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  }
);

router.put(
  "/:id/role",
  authenticateJWT,
  authorizeRoles(["admin"]),
  validate(updateUserRoleSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.role = role;
      await user.save();

      res.status(200).json({
        statusCode: 200,
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
);

export default router;
