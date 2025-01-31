import { Router } from "express";
import { body } from "express-validator";
import { createAccount } from "./handlers"; 

const router = Router();

// Routing
router.post("/auth/register",
    //Validation
    body('handle')
        .notEmpty()
        .withMessage('Handle is required'),
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Email not valid'),
    body('name')
        .isLength({ min: 8 })
        .withMessage('Password is required'), 
    //Handle
     createAccount
    ) ;

export default router;
