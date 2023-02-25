import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CreateCalendarApiDto } from './dto/create-calendar-api.dto';
import { UpdateCalendarApiDto } from './dto/update-calendar-api.dto';

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

@Injectable()
export class CalendarApiService implements OnModuleInit{



  onModuleInit(){
    const getTokens = this.authorize().then(this.listEvents).catch(console.error);
    Logger.debug (getTokens,'Token');
  }


  create(createCalendarApiDto: CreateCalendarApiDto) {
    return 'This action adds a new calendarApi';
  }

  findAll() {
    return `This action returns all calendarApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calendarApi`;
  }

  update(id: number, updateCalendarApiDto: UpdateCalendarApiDto) {
    return `This action updates a #${id} calendarApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendarApi`;
  }


  // https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=http%3A%2F%2Flocalhost%3A50169%2F&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=837400215722-n8g2urif25hmmp8a06jbvbhb58v00dru.apps.googleusercontent.com&service=lso&o2v=2&flowName=GeneralOAuthFlow


  // If modifying these scopes, delete token.json.
  SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  TOKEN_PATH = path.join(process.cwd(), './token.json');
  CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async  loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(this.TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async  saveCredentials(client) {
    const content = await fs.readFile(this.CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(this.TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async  authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async  listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    });
  }

  // authorize().then(listEvents).catch(console.error);


}
