import express from "express";
import { handleSignup, handleVerifyEmail } from "../controllers";

const authRoutes = express.Router();

authRoutes.post("/register", handleSignup);

authRoutes.post("/verification", handleVerifyEmail);

export default authRoutes;
