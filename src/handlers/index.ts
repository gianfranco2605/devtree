import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            res.status(409).send("User already exists");
            return;
        }

        const handle = slugify(req.body.handle, { lower: true });

        const handleExist = await User.findOne({ handle });
        if (handleExist) {
            res.status(409).send("Handler already exists");
            return;
        }

        const user = new User(req.body);

        user.password = await hashPassword(password);

        user.handle = handle;

        await user.save();

        res.status(201).send("User created");

    } catch (error) {

        next(error);

    }
};