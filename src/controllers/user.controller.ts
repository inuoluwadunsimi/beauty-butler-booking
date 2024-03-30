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
    ResponseManager.handleError(res, { message: "logged out" });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
