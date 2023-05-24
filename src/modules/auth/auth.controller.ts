import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Account } from "src/entities/user.entity";
import { HasuraRoles } from "src/common/types";
import { JwtService } from "@nestjs/jwt";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("login")
  @HttpCode(200)
  async getAccessToken(
    @Body() body: { username: string; password: string },
  ): Promise<string> {
    if (body != null) {
      const account = await this.authService.getUserInfoFromAccessToken(body);
      const signedUser: Partial<Account> & HasuraRoles = {
        ...account,
        "https://hasura.io/jwt/claims": {
          "x-hasura-default-role": account.role,
          "x-hasura-allowed-roles": [account.role],
          "x-hasura-user-id": String(account.id),
        },
        sub: String(account.id),
        audience: "thai",
        issuer: "thai-be",
      };
      const token = this.jwtService.sign(signedUser);
      return token;
    }
  }
}
