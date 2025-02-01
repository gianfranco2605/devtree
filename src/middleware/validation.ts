import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    console.log("from validation.ts", errors);   

    // If there are validation errors, send a 400 response.
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
    next();  
};