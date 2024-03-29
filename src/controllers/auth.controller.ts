import {
  type IExpressRequest,
  SignupRequest,
  VerifyEmailRequest,
} from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as authService from "../services/auth.service";

export async function handleSignup(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  const body: SignupRequest = req.body;
  try {
    await authService.Signup(body);
    ResponseManager.success(res, { message: "otp sent to email" });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleVerifyEmail(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  const body: VerifyEmailRequest = req.body;
  try {
    const authResponse = await authService.VerifyEmail(body);
    ResponseManager.success(res, { authResponse });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
