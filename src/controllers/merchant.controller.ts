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
    const schedules = await merchantService.viewMerchantSchedule(
      user as string
    );

    ResponseManager.success(res, { schedules });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetMerchantAppointments(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId;
  try {
    const appointments = await merchantService.getMerchantAppointments(
      user as string
    );
    ResponseManager.success(res, { appointments });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleUpdateAppointment(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { appointmentId } = req.params;
  const user = req.userId;
  const { status } = req.body;
  try {
    const appointment = await merchantService.updateAppointment({
      user: user as string,
      appointment: appointmentId,
      status,
    });
    ResponseManager.success(res, { appointment });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetOneAppointment(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { appointmentId } = req.params;
  try {
    const appointment = await merchantService.getOneAppointment(appointmentId);
    ResponseManager.success(res, { appointment });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
