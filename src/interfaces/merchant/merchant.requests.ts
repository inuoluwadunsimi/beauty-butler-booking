import { AppointmentStatus } from "../models/merchant.interface";

// merchant create schedule
export interface CreateSchedule {
  date: Date;
  startTime: string;
  endTime: string;
}

// update apointment interfac to change the status of an appointment
export interface UpdateAppointment {
  user: string;
  appointment: string;
  status: AppointmentStatus;
}
