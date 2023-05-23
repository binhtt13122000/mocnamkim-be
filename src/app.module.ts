import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { RouterModule, Routes } from "nest-router";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "./config/config.service";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { ResponseDataInterceptor } from "./interceptors/response-data.interceptor";

const routes: Routes = [
  {
    path: "/auth",
    module: AuthModule,
  },
];
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    RouterModule.forRoutes(routes),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseDataInterceptor,
    },
  ],
})
export class AppModule {}
