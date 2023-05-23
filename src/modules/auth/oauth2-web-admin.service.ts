import { OAuth2Service } from "./oauth2.service";
import { configService } from "../../config/config.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OAuth2WebAdminService extends OAuth2Service {
  constructor() {
    super(
      configService.getValue("GOOGLE_CLIENT_ID"),
      configService.getValue("GOOGLE_SECRET"),
      configService.getValue("WEB_ADMIN_ROOT_URL") + "/login",
    );
  }
}
