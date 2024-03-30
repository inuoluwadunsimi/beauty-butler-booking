import express from "express";
import { jwtHelper } from "../helpers/jwt/jwt.helper";
import { userRole } from "../interfaces";
import {
  handleCreateSchedule,
  handleViewMerchantSchedule,
} from "../controllers";

const merchantRoutes = express.Router();

merchantRoutes.post(
  "/schedules",
  jwtHelper.requirePermission([userRole.MERCHANT]),
  handleCreateSchedule
);
merchantRoutes.get(
  "/schedules",
  jwtHelper.requirePermission([userRole.MERCHANT]),
  handleViewMerchantSchedule
);

export default merchantRoutes;
