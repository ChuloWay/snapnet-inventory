import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : null;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

export default authenticateJWT;
