import {Router} from 'express';
import {loginUser, logoutUser, registerUser, refreshAccessToken} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import multer from 'multer';
const router = Router();
const noFileUpload = multer();

// User registration route
// This route handles user registration with file uploads for avatar and cover images
router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImages', 
            maxCount: 1
        }
    ]),
    registerUser
);

// router.route("/login").post(loginUser)
router.post("/login", noFileUpload.none(), loginUser);


//secure route 
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;  