import {
  Appointment,
  NotFoundError,
  Schedule,
  ScheduleStatus,
  User,
  userRole,
} from "../interfaces";
import { ScheduleDb, UserDb, UserTokenDb, AppointmentDb } from "../models";
import { BookAppointment } from "../interfaces/user/user.requests";

export async function getUserProfle(user: string): Promise<User> {
  const userDetails = await UserDb.findById<User>(user);
  if (!userDetails) {
    throw new NotFoundError("user not found");
  }
  return userDetails;
}

export async function getMerchants(): Promise<User[]> {
  return await UserDb.find<User>({ role: userRole.MERCHANT });
}

export async function getMerchantSchedule(
  merchantId: string
): Promise<Schedule[]> {
  /* find all schdules that match the merchant's ID and have not yet been booked*/
  return await ScheduleDb.find<Schedule>({
    merchant: merchantId,
    status: ScheduleStatus.AVAILABLE,
  });
}

export async function bookAppointment(
  payload: BookAppointment
): Promise<Appointment> {
  /*create and appoinment for the user using the scheduleId and userId

  * */

  const { user, schedule } = payload;

  const scheduleDetails = await ScheduleDb.findById<Schedule>(schedule);
  if (!scheduleDetails) {
    throw new NotFoundError("schedule not found");
  }

  const appointment = await AppointmentDb.create({
    schedule,
    customer: user,
    merchant: scheduleDetails.merchant,
  });

  scheduleDetails.status = ScheduleStatus.BOOKED;
  await scheduleDetails.save();
  return appointment;
}

export async function getAllUserAppointments(
  user: string
): Promise<Appointment[]> {
  return await AppointmentDb.find<Appointment>({ customer: user })
    .populate("schedule")
    .populate("merchant");
}

export async function logout(user: string): Promise<void> {
  /* delete all exisiting tokens*/
  await UserTokenDb.deleteMany({ user });
}
