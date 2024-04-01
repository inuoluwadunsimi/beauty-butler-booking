import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as userService from "../services/user.service";

export async function handleGetUserProfile(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId!;
  try {
    const userDetails = await userService.getUserProfle(user);
    ResponseManager.success(res, { userDetails });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleLogout(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId;
  try {
    await userService.logout(user as string);
    ResponseManager.success(res, { message: "logged out" });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetMerchants(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  try {
    const merchants = await userService.getMerchants();
    ResponseManager.success(res, { merchants });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetMerchantSchedule(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  const { merchantId } = req.params;
  try {
    const schedule = await userService.getMerchantSchedule(merchantId);
    ResponseManager.success(res, { schedule });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleBookAppointment(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { scheduleId } = req.params;
  const user = req.userId;

  try {
    const appointment = await userService.bookAppointment({
      user: user as string,
      schedule: scheduleId,
    });
    ResponseManager.success(res, { appointment });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetAllUserAppointments(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId;

  try {
    const appointments = await userService.getAllUserAppointments(
      user as string
    );
    ResponseManager.success(res, { appointments });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
