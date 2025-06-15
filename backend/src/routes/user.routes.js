import {Router} from 'express';
import {registerUser} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
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




export default router;