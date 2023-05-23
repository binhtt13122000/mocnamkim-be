import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { OAuth2Service } from "./oauth2.service";
import { TokenPayload } from "google-auth-library";
import { getManager } from "typeorm";
import { User } from "../../entities/user.entity";

@Injectable()
export class AuthService {
  async getAccessToken(
    code: string,
    oauth2Service: OAuth2Service,
  ): Promise<{ idToken: string; userInfo: TokenPayload }> {
    const responseData = await oauth2Service.getToken(code);
    const idToken =
      responseData?.tokens?.id_token || responseData?.res?.data?.id_token;
    const userInfo: TokenPayload = (
      await oauth2Service.verify(idToken)
    ).getPayload();
    return {
      idToken,
      userInfo,
    };
  }

  async getUserInfoFromAccessToken(
    userInfo: TokenPayload,
  ): Promise<Pick<User, "userId" | "email" | "name" | "role">> {
    const user = await getManager()
      .getRepository(User)
      .findOne(
        { email: userInfo.email, isActive: true },
        {
          select: ["userId", "email", "name", "role"],
        },
      );
    if (!user)
      throw new HttpException(
        "This user does not exist",
        HttpStatus.UNAUTHORIZED,
      );
    return user;
  }
}
