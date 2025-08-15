import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, getUserByHandle, login, updateProfile, uploadImage } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

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
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password to short'),
    //HandleErrors
    handleInputErrors,
    //Handle
    createAccount
);

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email not valid'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    login
);

router.get('/user', authenticate, getUser)

// Update
router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('Handle is required'),
    body('description')
        .notEmpty()
        .withMessage('Description is required'),
    handleInputErrors,
    authenticate,
    updateProfile
);

router.post('/user/image', authenticate, uploadImage)

router.get('/:handle', getUserByHandle)

export default router;
