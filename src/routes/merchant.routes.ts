import express from "express";
import { jwtHelper } from "../helpers/jwt/jwt.helper";
import { userRole } from "../interfaces";
import {
  handleCreateSchedule,
  handleGetMerchantAppointments,
  handleGetOneAppointment,
  handleUpdateAppointment,
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

merchantRoutes.get(
  "/appointments",
  jwtHelper.requirePermission([userRole.MERCHANT]),
  handleGetMerchantAppointments
);

merchantRoutes.put(
  "/appointments/:appointmentId",
  jwtHelper.requirePermission([userRole.MERCHANT]),
  handleUpdateAppointment
);

merchantRoutes.get(
  "/appointments/:appointmentId",
  jwtHelper.requirePermission([userRole.MERCHANT]),
  handleGetOneAppointment
);

export default merchantRoutes;
