// This is where i set config for mongodb etc

import * as dotenv from "dotenv";

export const config = {
  jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
  mongodb: {
    uri: <string>process.env.MONGODB_URI,
    collections: {
      users: "users",
      userAuth: "user_auths",
      userToken: "user_tokens",
      userVerification: "userVerifications",
      merchant: "merchants,",
    },
  },
  mailing: {
    resendAPIKey: process.env["RESEND_KEY"],
    emailSender: <string>process.env.EMAIL_SENDER,
  },
};
