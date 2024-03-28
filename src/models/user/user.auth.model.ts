import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { type UserAuth, userRole } from "../../interfaces";

const userAuth = new Schema<UserAuth>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    email: {
      type: String,
      required: true,
      lowerCase: true,
      true: true,
    },
    password: {
      type: String,
    },
    user: {
      type: String,
      requiredPaths: true,
      ref: config.mongodb.collections.users,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.USER,
    },

    verified: {
      type: Boolean,
      default: false,
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

export const UserAuthDb = mongoose.model(
  config.mongodb.collections.userAuth,
  userAuth
);
