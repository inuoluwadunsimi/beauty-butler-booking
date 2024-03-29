import {
  SignupRequest,
  OtpType,
  User,
  BadRequestError,
  VerifyEmailRequest,
  AuthResponse,
  UserVerification,
  UserAuth,
  NotFoundError,
  userRole,
} from "../interfaces";
import { UserDb, UserVerDb, UserAuthDb, UserTokenDb } from "../models";
import bcrypt from "bcrypt";
import { generateOtp } from "../helpers/utils";
import { jwtHelper } from "../helpers/jwt/jwt.helper";
import { MerchantDb } from "../models/mentor/merchant.model";
import { Mailer } from "./email.service";

export async function Signup(body: SignupRequest): Promise<void> {
  let { email } = body;
  const { fullName, password, role } = body;
  email = email.toLowerCase();

  /* check if the user is already signed up
  if user is signed up, send error message asking them to login
  *  */
  const existingUser = await UserDb.findOne<User>({ email });
  if (existingUser) {
    throw new BadRequestError("user exists, login instead");
  }

  const user = await UserDb.create({
    email,
    fullName,
  });

  /*encrypt password then save password to userauth db
  userAuth model contains sensitive user information,
  set isVerified to false till email is verified via otp
  this is already been set as default in the userAuth model
  * */
  const encryptedPassword = await bcrypt.hash(password, 12);

  await UserAuthDb.create({
    password: encryptedPassword,
    email,
    user: user.id,
    role,
  });

  /*create otp and send it to the user's mail*/
  const otp = generateOtp();
  await UserVerDb.create({
    email,
    otp,
    type: OtpType.SIGN_UP,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  //TODO: send email
  await Mailer.sendSignupOtp({
    otp,
    recipient: email,
  });
}

export async function VerifyEmail(
  body: VerifyEmailRequest
): Promise<AuthResponse> {
  const { otp, email } = body;

  /*check the user verification model to see if a record matching the otp and email exists
   * if it does not exist, throw an error, if it exists, update verified to true
   * generate a an accessToken and save the toeken to the db then return the token
   * and the user object as the API response*/

  const verification = await UserVerDb.findOne<UserVerification>({
    email,
    otp,
    type: OtpType.SIGN_UP,
  });

  if (!verification) {
    throw new BadRequestError("Otp entered is incorrect");
  } else if (new Date(verification.expiresAt) < new Date()) {
    throw new BadRequestError("Otp has expired");
  }

  const userAuthRecord = await UserAuthDb.findOneAndUpdate<UserAuth>(
    { email },
    {
      verified: true,
    }
  );
  if (!userAuthRecord) {
    throw new NotFoundError("auth record not found");
  }

  /*if the user is a merchant, create a merchant record*/

  const user = await UserDb.findOne<User>({ email });
  if (!user) {
    throw new NotFoundError("user not found");
  }

  if (userAuthRecord.role === userRole.MERCHANT) {
    await MerchantDb.create({
      user: user.id,
    });
  }

  const accessToken = jwtHelper.generateToken({
    email,
    userId: user.id,
    role: userAuthRecord.role,
  });

  await UserTokenDb.create({
    email,
    accessToken,
    user: user.id,
  });

  return {
    accessToken,
    user,
  };
}
