import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { getManager } from "typeorm";
import { Account } from "../../entities/user.entity";

@Injectable()
export class AuthService {
  async getUserInfoFromAccessToken(userInfo: {
    username: string;
    password: string;
  }): Promise<Pick<Account, "id" | "username" | "name" | "role" | "password">> {
    const account = await getManager()
      .getRepository(Account)
      .findOne(
        { username: userInfo.username, password: userInfo.password },
        {
          select: ["id", "username", "name", "role"],
        },
      );
    if (!account)
      throw new HttpException(
        "This user does not exist",
        HttpStatus.UNAUTHORIZED,
      );
    return account;
  }
}
