import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HasuraRoles } from "../../common/types";
import { User } from "../../entities/user.entity";

@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(
    userInfoWithHasuraRoles: Partial<User> & HasuraRoles,
    isRememberMe: boolean,
  ): Promise<string> {
    return this.jwtService.sign(userInfoWithHasuraRoles, {
      expiresIn: isRememberMe ? "7d" : "12h",
    });
  }
}
