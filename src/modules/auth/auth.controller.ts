import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { configService } from "../../config/config.service";
import { AuthService } from "./auth.service";
import * as querystring from "querystring";
import { OAuth2WebAdminService } from "./oauth2-web-admin.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { HasuraRoles } from "src/common/types";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauth2WebAdminService: OAuth2WebAdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Get("redirect-url")
  getRedirectUrl(@Query("returnUrl") returnUrl: string) {
    const redirectUri = configService.getWebAdminRootURL() + "/login";
    const qString = querystring.stringify({
      client_id: configService.getGoogleClientID(),
      redirect_uri: redirectUri,
      scope: "profile openid email", // space seperated string
      response_type: "code",
      access_type: "offline",
      suppress_webview_warning: "true",
      prompt: "consent",
      state: Buffer.from(returnUrl || "", "utf-8").toString("base64"),
    });
    const googleAuthUri = configService.getGoogleAuthURI();
    return `${googleAuthUri}?${qString}`;
  }

  @Post("token")
  async getAccessToken(@Body() body: { code: string }): Promise<string> {
    console.log("getting the token", body.code);
    const { userInfo } = await this.authService.getAccessToken(
      body.code,
      this.oauth2WebAdminService,
    );
    const user = await this.authService.getUserInfoFromAccessToken(userInfo);

    const signedUser: Partial<User> & HasuraRoles = {
      ...user,
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": user.role,
        "x-hasura-allowed-roles": [user.role],
        "x-hasura-user-id": user.userId,
      },
      audience: "fcode-storybook",
      issuer: "fcode-storybook-backend",
    };
    const token = this.jwtService.sign(signedUser);
    return token;
    // Connect database to create/get info of user
    // Sign a jwt with hasura permission
    // Return hasura token
    // const token = await getManager
  }
}
