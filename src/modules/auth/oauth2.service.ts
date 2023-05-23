import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { Injectable } from "@nestjs/common";

export interface IOAuthConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  passReqToCallback: boolean;
}

@Injectable()
export abstract class OAuth2Service {
  protected oauth2Client: OAuth2Client;

  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly redirectUri: string,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
  }

  getConfig(): IOAuthConfig {
    return {
      clientID: this.clientId,
      clientSecret: this.clientSecret,
      callbackURL: this.redirectUri,
      passReqToCallback: false,
    };
  }

  async verify(token: string) {
    return this.oauth2Client.verifyIdToken({
      idToken: token,
      audience: this.clientId,
    });
  }

  async getToken(code: string): Promise<GetTokenResponse> {
    return this.oauth2Client.getToken(code);
  }
}
