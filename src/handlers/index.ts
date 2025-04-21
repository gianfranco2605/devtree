import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";
import { v4 as uuid } from "uuid"
import formidable from "formidable";
import cloudinary from "../conf/cloudinary";
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
      return;

    }

    const token = generateJWT({ id: user._id });

    res.send(token);

  } catch (error) {

    res.status(500).send('Server error');
  }

}

export const getUser = async (req: Request, res: Response) => {

  res.json(req.user); 

}

export const updateProfile = async (req: Request, res: Response) => {

  try {
    
    const { description, links } = req.body;

    const Userhandle = slugify(req.body.handle, { lower: true });

    const handleExist = await User.findOne({ Userhandle });

    if (handleExist && handleExist.email !== req.user.email) {

      res.status(409).send("Handle already exists");

      return;

    }

    //Update user
    req.user.description = description;

    req.user.handle = Userhandle;

    req.user.links = links

    await req.user.save();

    res.send('Profile updated');

  } catch (e) {

    const error = new Error('Handle already exists');
    res.status(500).json({error: error.message})
    
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  // Initialize formidable with a single file upload setting.
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing files:", err);
      return res.status(500).json({ error: "Error parsing the files" });
    }

    // Check for file using proper key ("file") or fallback to an empty key.
    const fileKey = files.file ? "file" : "";
    const fileArray = fileKey ? files[fileKey] : files[""] || [];

    if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Handle both array and single file object.
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    // Validate file type (allow only image files).
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      console.error("Invalid file type:", file.mimetype);
      return res.status(400).json({ error: "Invalid file type. Only images are allowed." });
    }

    try {
      // Wrap Cloudinary upload in a Promise for async/await usage.
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.filepath, { public_id: uuid() }, async (error, result) => {
          if (error) {
            const error = new Error("Error uploading file to Cloudinary");
            return res.status(500).json({ error: error.message });
          }
          if(result) {
            req.user.image = result.secure_url;
            await req.user.save();
            res.json({image: result.secure_url });
          }
        });
      });

      console.info("File uploaded successfully", result);
      res.json({ result });
    } catch (uploadError: any) {
      console.error("Cloudinary upload error:", uploadError);
      res.status(500).json({ error: uploadError.message });
    }
  });
};