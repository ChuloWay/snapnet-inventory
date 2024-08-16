import express, { Request, Response, NextFunction } from 'express';

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
    next();
  };

  export default validate;
