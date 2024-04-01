import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { Appointment, AppointmentStatus } from "../../interfaces";

const appointmentSchema = new Schema<Appointment>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    // appointment references the schedule mode to get details about the time slots;
    schedule: {
      type: String,
      required: true,
      ref: config.mongodb.collections.schedule,
    },
    customer: {
      type: String,
      required: true,
      ref: config.mongodb.collections.users,
    },
    merchant: {
      type: String,
      required: true,
      ref: config.mongodb.collections.users,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
    versionKey: false,
    //
  }
);

export const AppointmentDb = mongoose.model(
  config.mongodb.collections.appointment,
  appointmentSchema
);
