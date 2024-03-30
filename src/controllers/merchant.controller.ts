import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import { IExpressRequest } from "../interfaces";
import { CreateSchedule } from "../interfaces";
import * as merchantService from "../services/merchant.service";

export async function handleCreateSchedule(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId;
  const body: CreateSchedule[] = req.body;
  try {
    await merchantService.createSchedule(user as string, body);
    ResponseManager.success(res, { message: "schedules created" });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleViewMerchantSchedule(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId;

  try {
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
