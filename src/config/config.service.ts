/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require("dotenv").config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue("API_PORT", true);
  }

  public getApiRootURL() {
    return this.getValue("API_ROOT_URL", true);
  }

  public getWebAdminRootURL() {
    return this.getValue("WEB_ADMIN_ROOT_URL", true);
  }

  public getHasuraUrl() {
    return this.getValue("HASURA_ROOT_URL", true);
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.getValue("POSTGRES_HOST"),
      port: parseInt(this.getValue("POSTGRES_PORT")),
      username: this.getValue("POSTGRES_USER"),
      password: this.getValue("POSTGRES_PASSWORD"),
      database: this.getValue("POSTGRES_DB"),

      entities: ["dist/entities/*.entity{.ts,.js}"],
    };
  }
}

const configService = new ConfigService({
  ...process.env,
}).ensureValues([
  "API_PORT",
  "API_ROOT_URL",
  "WEB_ADMIN_ROOT_URL",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
]);

export { configService };
