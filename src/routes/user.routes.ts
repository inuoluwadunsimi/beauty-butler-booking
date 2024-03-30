import express from "express";
import { jwtHelper } from "../helpers/jwt/jwt.helper";
import { userRole } from "../interfaces";
import {
  handleGetMerchants,
  handleGetMerchantSchedule,
  handleGetUserProfile,
  handleLogout,
} from "../controllers";

const userRoutes = express.Router();

userRoutes.get(
  "/me",
  jwtHelper.requirePermission([userRole.USER, userRole.MERCHANT]),
  handleGetUserProfile
);

userRoutes.post(
  "/logout",
  jwtHelper.requirePermission([userRole.USER, userRole.MERCHANT]),
  handleLogout
);

userRoutes.get("/merchants", handleGetMerchants);

userRoutes.get(
  "/schedules/:merchantId",
  jwtHelper.requirePermission([userRole.USER]),
  handleGetMerchantSchedule
);

export default userRoutes;
