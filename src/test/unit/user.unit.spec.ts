import mongoose from "mongoose";
import { AppointmentDb, ScheduleDb, UserDb, UserTokenDb } from "../../models";
import { NotFoundError, userRole, ScheduleStatus } from "../../interfaces";

require("dotenv").config();
import * as userService from "../../services/user.service";

describe("user service", () => {
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

  describe("getUserProfile", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      UserDb.findById = jest.fn().mockResolvedValue(null); // Simulate user not found

      await expect(
        userService.getUserProfle("nonExistingUserId")
      ).rejects.toThrow(NotFoundError);
    });

    it("should return user details if user exists", async () => {
      const mockUserDetails = {
        id: "1",
        fullName: "John Doe",
        role: userRole.USER,
        email: "tester@test.com",
      };
      UserDb.findById = jest.fn().mockResolvedValue(mockUserDetails); // Simulate user found

      const userDetails = await userService.getUserProfle("existingUserId");
      expect(userDetails).toEqual(mockUserDetails);
    });
  });

  describe("getMerchants", () => {
    it("should return a list of merchants", async () => {
      const mockMerchants = [
        {
          id: "1",
          fullName: "Merchant One",
          email: "merchantone@test.com",
          role: userRole.MERCHANT,
        },
        {
          id: "2",
          fullName: "Merchant TWO",
          email: "merchanttwo@test.com",
          role: userRole.MERCHANT,
        },
      ];
      UserDb.find = jest.fn().mockResolvedValue(mockMerchants); // Simulate finding merchants

      const merchants = await userService.getMerchants();
      expect(merchants).toEqual(mockMerchants);
    });
  });

  describe("getMerchantSchedule", () => {
    it("should return available schedules for a merchant", async () => {
      const mockSchedules = [
        {
          id: "1",
          merchant: "224-222",
          date: "2023-01-01",
          startTime: "10:00",
          endTime: "11:00",
          status: ScheduleStatus.AVAILABLE,
        },
        {
          id: "2",
          merchant: "228-222",
          date: "2023-01-01",
          startTime: "10:00",
          endTime: "11:00",
          status: ScheduleStatus.AVAILABLE,
        },
      ];
      ScheduleDb.find = jest.fn().mockResolvedValue(mockSchedules);

      const schedules = await userService.getMerchantSchedule("merchantId");
      expect(schedules).toEqual(mockSchedules);
    });
  });

  describe("bookAppointment", () => {
    it("should throw NotFoundError if schedule does not exist", async () => {
      ScheduleDb.findById = jest.fn().mockResolvedValue(null);

      await expect(
        userService.bookAppointment({
          user: "userId",
          schedule: "nonExistingScheduleId",
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should book an appointment if schedule exists", async () => {
      const mockScheduleDetails = {
        id: "1",
        merchant: "merchantId",
        status: ScheduleStatus.AVAILABLE,
        save: jest.fn(),
      };
      ScheduleDb.findById = jest.fn().mockResolvedValue(mockScheduleDetails);
      AppointmentDb.create = jest.fn().mockResolvedValue({}); // Simulate appointment creation

      await userService.bookAppointment({
        user: "userId",
        schedule: "existingScheduleId",
      });
      expect(AppointmentDb.create).toHaveBeenCalled();
      expect(mockScheduleDetails.save).toHaveBeenCalled();
    });
  });

  describe("getAllUserAppointments", () => {
    it("should return all appointments for a user", async () => {
      AppointmentDb.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([
            // Mocked return value for the final query result
            {
              id: "1",
              schedule: {
                id: "22",
                merchant: "kdkn",
                date: "24-12-23",
                startTime: "11:00",
                endTime: "12:00",
                status: ScheduleStatus.AVAILABLE,
              },
              merchant: {
                id: "33432",
                email: "testmerchant@test.com",
                role: userRole.MERCHANT,
                fullName: "big merchant",
              },
              customer: "userId",
            },
          ]),
        }),
      });

      const appointments = await userService.getAllUserAppointments("userId");
      expect(appointments).toHaveLength(1);
    });
  });

  describe("logout", () => {
    it("should delete all user tokens", async () => {
      UserTokenDb.deleteMany = jest.fn().mockResolvedValue({}); // Simulate token deletion

      await userService.logout("userId");
      expect(UserTokenDb.deleteMany).toHaveBeenCalledWith({ user: "userId" });
    });
  });
});
