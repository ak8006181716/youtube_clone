import {Router} from 'express';
import {loginUser, logoutUser, registerUser} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

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

router.route("/login").post(loginUser)


//secure route 
router.route("/logout").post(verifyJWT, logoutUser);

export default router;