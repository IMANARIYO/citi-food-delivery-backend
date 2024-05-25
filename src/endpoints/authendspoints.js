import  express from "express";
import { addAdmin, changepassword, deleteUserById, generateAndSendOTP, getAllUsers, login, removeAddimin, signup, updateDeliveryLocation, updateUserById, verifyOTPAndUpdatePassword } from "../authentication/index.js";
import { isAdmin } from "../middlewares/isadmin.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const authRouter = express.Router();
authRouter.post("/login",login);
authRouter.post("/signup",signup);
authRouter.post("/reset", verifyOTPAndUpdatePassword);
authRouter.post("/forget", generateAndSendOTP);
authRouter.use(verifyingtoken)
authRouter.get("/getAllUsers", getAllUsers);
authRouter.post("/change", changepassword);
authRouter.delete("/deleteUserById/:id", deleteUserById);
authRouter.patch("/updateUserById/:id",isAdmin, updateUserById);
authRouter.patch("/addadminbyid/:id",isAdmin,addAdmin)
authRouter.patch("/maketheadminasuser/:id",isAdmin,removeAddimin)
authRouter.patch("/updateDeliveryLocation", updateDeliveryLocation);
authRouter.delete("/deleteuserbyid/:id",isAdmin,deleteUserById)

export default authRouter;
