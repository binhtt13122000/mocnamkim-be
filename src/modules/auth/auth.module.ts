import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OAuth2WebAdminService } from "./oauth2-web-admin.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: "7d" },
        };
      },
    }),
  ],
  providers: [AuthService, OAuth2WebAdminService],
  controllers: [AuthController],
})
export class AuthModule {}
