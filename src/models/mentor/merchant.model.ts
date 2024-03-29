import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { Merchant } from "../../interfaces";

const merchantSchema = new Schema<Merchant>({
  _id: {
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  },
  user: {
    type: String,
    required: true,
    ref: config.mongodb.collections.users,
  },
  schedule: [
    {
      date: {
        type: Date,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  ],
});

export const MerchantDb = mongoose.model(
  config.mongodb.collections.merchant,
  merchantSchema
);
