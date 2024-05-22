import  express from "express";
import { changepassword, deleteUserById, generateAndSendOTP, getAllUsers, login, signup, updateUserById, verifyOTPAndUpdatePassword } from "../authentication/index.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const authRouter = express.Router();
authRouter.post("/login",login);
authRouter.post("/signup",signup);
authRouter.post("/reset", verifyOTPAndUpdatePassword);
authRouter.post("/forget", generateAndSendOTP);
//  authRouter.use(verifyingtoken)
authRouter.get("/getAllUsers", getAllUsers);
authRouter.post("/change", changepassword);
authRouter.delete("/deleteUserById/:id", deleteUserById);
authRouter.patch("/updateUserById/:id", updateUserById);
export default authRouter;
