import mongoose from "mongoose";
import { AppointmentDb, ScheduleDb } from "../../models";
import { AppointmentStatus } from "../../interfaces";
import * as merchantService from "../../services/merchant.service";
import { NotFoundError } from "../../interfaces";

require("dotenv").config();

describe("merchant service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB as string);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("createSchedule", () => {
    it("saves multiple schedules for a merchant", async () => {
      const user = "merchant123";
      const body = [
        { date: new Date("2023-01-01"), startTime: "11:00", endTime: "12:00" },
        { date: new Date("2023-01-02"), startTime: "11:00", endTime: "12:00" },
      ];
      ScheduleDb.create = jest.fn().mockResolvedValue(body);

      await merchantService.createSchedule(user, body);

      expect(ScheduleDb.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("viewMerchantSchedule", () => {
    it("fetches schedules for a merchant", async () => {
      const mockSchedules = [
        {
          date: "2023-01-01",
          startTime: "11:00",
          endTime: "2:00",
          merchant: "merchant123",
        },
      ];
      ScheduleDb.find = jest.fn().mockResolvedValue(mockSchedules);

      const schedules =
        await merchantService.viewMerchantSchedule("merchant123");

      expect(ScheduleDb.find).toHaveBeenCalledWith({ merchant: "merchant123" });
      expect(schedules).toEqual(mockSchedules);
    });
  });
  describe("getMerchantAppointments", () => {
    it("fetches all appointments for a merchant", async () => {
      const mockAppointments = [{ _id: "app1", status: "scheduled" }];
      AppointmentDb.find = jest.fn().mockResolvedValue(mockAppointments);

      const appointments =
        await merchantService.getMerchantAppointments("merchant123");

      expect(AppointmentDb.find).toHaveBeenCalledWith({
        merchant: "merchant123",
      });
      expect(appointments).toEqual(mockAppointments);
    });
  });
  describe("updateAppointment", () => {
    it("updates an appointment status", async () => {
      const mockUpdatedAppointment = {
        id: "app1",
        status: AppointmentStatus.COMPLETED,
        customer: "customerId",
        merchant: "merchant123",
        schedule: "scheduleId",
      };
      AppointmentDb.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedAppointment);

      const updatedAppointment = await merchantService.updateAppointment({
        status: AppointmentStatus.COMPLETED,
        user: "merchant123",
        appointment: "app1",
      });

      expect(AppointmentDb.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "app1", merchant: "merchant123" },
        { status: "completed" },
        { new: true }
      );
      expect(updatedAppointment).toEqual(mockUpdatedAppointment);
    });
  });

  describe("getOneAppointment", () => {
    it("fetches details of a single appointment", async () => {
      const mockAppointment = {
        id: "app1",
        status: AppointmentStatus.PENDING,
        custopmer: "customerId",
        merchant: "merchantId",
      };
      AppointmentDb.findById = jest.fn().mockResolvedValue(mockAppointment);

      const appointment = await merchantService.getOneAppointment("app1");

      expect(AppointmentDb.findById).toHaveBeenCalledWith("app1");
      expect(appointment).toEqual(mockAppointment);
    });

    it("throws NotFoundError if appointment not found", async () => {
      AppointmentDb.findById = jest.fn().mockResolvedValue(null);

      await expect(
        merchantService.getOneAppointment("nonexistent")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
