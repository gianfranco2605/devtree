import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const { email, password, handle } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(409).send("User already exists");
      return;
    }

    // Generate a slug for the handle.
    const Userhandle = slugify(req.body.handle, { lower: true });

    const handleExist = await User.findOne({ Userhandle });
    if (handleExist) {
      res.status(409).send("Handle already exists");
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

export const login = async (req: Request, res: Response) => {

  try {
    const errors = validationResult(req);

    // If there are validation errors, send a 400 response.
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      res.status(409).send("User does not exists");
      return;
    }
    // Check if password is correct

    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error('Invalid password');
      res.status(401).json({ error: error.message });
      return  
    }

    generateJWT(user);

    res.send('Authenticated');

  } catch (error) {

    res.status(500).send('Server error');
  }

}
