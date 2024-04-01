import {
  Appointment,
  CreateSchedule,
  NotFoundError,
  Schedule,
  UpdateAppointment,
} from "../interfaces";
import { AppointmentDb, ScheduleDb } from "../models";

export async function createSchedule(
  user: string,
  body: CreateSchedule[]
): Promise<void> {
  /* save multiple schedule details ay once for a single merchant*/
  const schedules = body.map((schedule) => ({
    ...schedule,
    merchant: user,
  }));

  await ScheduleDb.create(schedules);
}

export async function viewMerchantSchedule(user: string): Promise<Schedule[]> {
  return await ScheduleDb.find<Schedule>({ merchant: user });
}

export async function getMerchantAppointments(
  user: string
): Promise<Appointment[]> {
  /*get all appointments for a single merchant*/
  return await AppointmentDb.find({ merchant: user });
}

export async function updateAppointment(
  payload: UpdateAppointment
): Promise<Appointment> {
  /* this function helps to indicate anappointment as either completed or cancelled*/
  const { status, user, appointment } = payload;
  const appointmentDetails = await AppointmentDb.findOneAndUpdate<Appointment>(
    { _id: appointment, merchant: user },
    {
      status,
    },
    { new: true }
  );
  if (!appointmentDetails) {
    throw new NotFoundError("appointment not found");
  }
  return appointmentDetails;
}

export async function getOneAppointment(
  appointmentId: string
): Promise<Appointment> {
  const appointment = await AppointmentDb.findById<Appointment>(appointmentId)
    .populate("schedule")
    .populate("customer");
  if (!appointment) {
    throw new NotFoundError("appointment details not found");
  }
  return appointment;
}
