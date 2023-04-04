import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './google-auth.service';
import { google } from 'googleapis';

@Controller('events')
export class CalendarEventsController {
  private readonly googleCalendar = google.calendar('v3');

  constructor(
    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post()
  async createEvent(@Body() event: any) {
    const { refreshToken } = event;

    // Obtenemos un token de acceso a partir del token de actualización
    const accessToken = await this.googleAuthService.getAccessTokenFromRefreshToken(refreshToken);

    // Configuramos las credenciales de autenticación de la API de Google Calendar
    const auth = new google.auth.OAuth2({
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri: this.configService.get('GOOGLE_REDIRECT_URI'),
      credentials: {
        access_token: accessToken,
      },
    });

    // Creamos el evento en el calendario
    await this.googleCalendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        location: event.location,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Los_Angeles',
        },
        attendees: event.attendees,
        reminders: {
          useDefault: true,
        },
      },
    });

    return { message: 'Event created successfully' };
  }
}
