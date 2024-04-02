import {
  type IExpressRequest,
  LoginRequest,
  SignupRequest,
  VerifyEmailRequest,
} from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as authService from "../services/auth.service";

// signuop controller
export async function handleSignup(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  // extract the request body as interface of signup request
  const body: SignupRequest = req.body;
  try {
    // pass request body to signup service function
    await authService.Signup(body);
    // handle response
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

export async function handleLogin(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  const body: LoginRequest = req.body;
  try {
    const authResponse = await authService.login(body);
    ResponseManager.success(res, { authResponse });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
