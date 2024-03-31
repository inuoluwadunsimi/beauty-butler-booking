import { AppointmentStatus } from "../models/merchant.interface";

export interface CreateSchedule {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface UpdateAppointment {
  user: string;
  appointment: string;
  status: AppointmentStatus;
}
