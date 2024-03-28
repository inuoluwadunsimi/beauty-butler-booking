import { SignupRequest, OtpType, User, BadRequestError } from "../interfaces";
import { UserDb, UserVerDb, UserAuthDb } from "../models";
import bcrypt from "bcrypt";
import { generateOtp } from "../helpers/utils";

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
}
