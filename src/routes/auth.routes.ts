import express from "express";
import { handleLogin, handleSignup, handleVerifyEmail } from "../controllers";

const authRoutes = express.Router();

authRoutes.post("/register", handleSignup);

authRoutes.post("/verification", handleVerifyEmail);

authRoutes.post("/login", handleLogin);

export default authRoutes;
