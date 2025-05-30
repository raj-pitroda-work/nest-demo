import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //when we need directly from authorization header itself
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;
          if (req && req.headers && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
          } else if (req && req.cookies) {
            token = req.cookies["token"];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY!,
    });
  }

  validate(payload: any) {
    return payload;
  }
}
