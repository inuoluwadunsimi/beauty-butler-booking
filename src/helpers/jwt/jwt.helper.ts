import * as jwt from "jsonwebtoken";
import { type Response } from "express";
import { type JwtConfig } from "./types";
import { type IExpressRequest, userRole } from "../../interfaces";
import { UserTokenDb } from "../../models";
import { config } from "../../constants/settings";

interface GenerateTokenParam {
  email: string;
  userId?: string;
  role: userRole;
  expiresIn?: number;
}

export class JwtHelper {
  private readonly configOption: JwtConfig;
  handleJsonResponse?: Function;
  UserTokenDb: any;

  constructor(configOption: JwtConfig) {
    this.configOption = configOption;
    this.handleJsonResponse = configOption.handleJsonResponse;
    this.UserTokenDb = configOption.UserTokenDb;
  }

  respondError(res: Response, code: number, message: string) {
    if (this.handleJsonResponse) {
      return this.handleJsonResponse(code, message);
    }
    res.status(403).json({ error: true, message });
  }

  generateToken(body: GenerateTokenParam): string {
    const encryptionKey = Buffer.from(
      this.configOption.privateKey,
      "base64"
    ).toString();

    return jwt.sign(
      {
        email: body.email,
        userId: body.userId,
        role: body.role,
      },
      encryptionKey,
      { expiresIn: "30d" }
    );
  }

  async verifyToken(token: string): Promise<GenerateTokenParam> {
    try {
      const result = jwt.verify(
        token,
        Buffer.from(this.configOption.privateKey, "base64").toString()
      );
      return result as GenerateTokenParam;
    } catch (error: any) {
      console.error(error);
      throw {
        code: 403,
        data: error,
      };
    }
  }

  requirePermission(roleType: userRole[]) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return async (req: IExpressRequest, res: Response, next: Function) => {
      const token = req.headers["x-auth-token"];
      if (!token) {
        return this.respondError(res, 403, "No API token");
      }

      try {
        if (typeof token !== "string") {
          return this.respondError(
            res,
            403,
            "Auth token is not a valid string"
          );
        }

        const dbToken = await this.UserTokenDb.findOne({ accessToken: token });
        if (!dbToken) {
          return this.respondError(res, 403, "invalid token");
        }

        const decoded = await this.verifyToken(token);

        if (!roleType.includes(decoded.role)) {
          return this.respondError(res, 403, "Access denied");
        }
        req.email = decoded.email;
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.role = decoded.role;

        return next();
      } catch (error: any) {
        return this.respondError(res, 403, error);
      }
    };
  }
}

export const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});
