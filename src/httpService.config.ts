import { Injectable } from "@nestjs/common";
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return {
            headers: {
                'Authorization': 'Bearer EAAGvZCoWRtiUBALFiJO0IX0WF1bRtYdQDsZCPwOvWiggS5ysGwOmntwJnxMioDNn8TVMWtZA6aaTdkV0MLMiOV0lqXu1hmA4nfkZCZAXoo54l9xikcMIymPe0mDxZCmQZBcj7YF3iYNNyOxckaQwa1ANzo68hrRKubpk9AhQtGnssh6TL47oMY4Xa6weYSY96F6zDY6Rj9LbXNnwqQnZAHD8',
                'Content-Type': 'application/json'
            }
        }
    }
}