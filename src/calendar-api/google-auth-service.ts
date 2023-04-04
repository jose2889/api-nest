import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { googleAuthConfig } from './google-auth.config';

@Injectable()
export class GoogleAuthService {
  private readonly oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      googleAuthConfig.clientId,
      googleAuthConfig.clientSecret,
      googleAuthConfig.redirectUrl,
    );
  }

  getAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: googleAuthConfig.scopes,
    });
  }

  async getAccessTokenFromCode(code: string): Promise<string> {
    const { tokens } = await this.oAuth2Client.getToken(code);
    return tokens.access_token;
  }

  async getAuthClient(): Promise<OAuth2Client> {
    const credentials = await this.getCredentials();
    this.oAuth2Client.setCredentials(credentials);
    return this.oAuth2Client;
  }

  private async getCredentials(): Promise<Record<string, string>> {
    // Aquí deberías obtener las credenciales de autenticación de Google.
    // Puedes guardarlas en una base de datos, en un archivo, en una variable de entorno, etc.
    // En este ejemplo, las guardamos en una constante para simplificar el código.
    return {
      access_token: 'ACCESS_TOKEN',
      refresh_token: 'REFRESH_TOKEN',
      scope: 'SCOPE',
      token_type: 'TOKEN_TYPE',
      expiry_date: 'EXPIRY_DATE',
    };
  }
}
