import { Request, Response, NextFunction } from 'express';
import User from '../models/Users';

export const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            res.status(409).json({ error: 'El usuario ya existe' });
        }

        const user = new User(req.body);

        await user.save();

        res.status(201).send('Registro creado con éxito');
    } catch (error) {
        next(error);
    }
};
