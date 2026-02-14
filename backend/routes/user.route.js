import  express from "express";
const router=express.Router();
import  {editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register} from '../controllers/user.controller.js'
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js";

// Using router.route() allows us to handle multiple HTTP methods (GET, POST, PUT, DELETE)
// for the same endpoint in a clean and organized way.

router.route('/register').post(register) 
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated,getProfile)
router.route('/profile/edit').patch(isAuthenticated,upload.single('profilePicture'),editProfile)
router.route('/suggested').get(isAuthenticated,getSuggestedUsers)
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow) 

export default router;   