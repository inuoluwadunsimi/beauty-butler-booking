import express from "express";

const userRoutes = express.Router();

userRoutes.get("/me");

export default userRoutes;
