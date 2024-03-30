import express from "express";
import { jwtHelper } from "../helpers/jwt/jwt.helper";
import { userRole } from "../interfaces";
import { handleGetUserProfile, handleLogout } from "../controllers";

const userRoutes = express.Router();

userRoutes.get(
  "/me",
  jwtHelper.requirePermission([userRole.USER, userRole.MERCHANT]),
  handleGetUserProfile
);

userRoutes.get(
  "/logout",
  jwtHelper.requirePermission([userRole.USER, userRole.MERCHANT]),
  handleLogout
);

export default userRoutes;
