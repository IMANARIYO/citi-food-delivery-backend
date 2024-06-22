import  express from "express";
import { addAdmin, changepassword, deleteUserById, generateAndSendOTP, getAllUsers, login, removeAddimin, signup, updateDeliveryLocation, updateUserById, verifyOTPAndUpdatePassword } from "../authentication/index.js";
import { isAdmin } from "../middlewares/isadmin.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";
import { uploaded } from "../utils/multer.js";

const authRouter = express.Router();
authRouter.post("/login",login);
authRouter.post("/signup",uploaded,signup);
authRouter.post("/reset", verifyOTPAndUpdatePassword);
authRouter.post("/forget", generateAndSendOTP);
// authRouter.use(verifyingtoken)
authRouter.get("/getAllUsers", getAllUsers);
authRouter.post("/change", changepassword);
authRouter.delete("/deleteUserById/:id", deleteUserById);
authRouter.patch("/updateUserById/:id",uploaded,updateUserById);
authRouter.patch("/addadminbyid/:id",isAdmin,addAdmin)
authRouter.patch("/maketheadminasuser/:id",isAdmin,removeAddimin)
authRouter.patch("/updateDeliveryLocation",uploaded, updateDeliveryLocation);
authRouter.delete("/deleteuserbyid/:id",isAdmin,deleteUserById)

export default authRouter;
