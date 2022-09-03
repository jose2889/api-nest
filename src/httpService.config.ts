import { Injectable } from "@nestjs/common";
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return {
            headers: {
                'Authorization': 'Bearer EAAGvZCoWRtiUBAI7UQcejfnr0qwfrowTziG7l21p0KXILpotbowNdIdSuwp1hZByvze3WOiZB2DdOWkbGBQMN07ZCyBT4M696NZBx8b7ookUT5SLtdbUVF2mK0Ar7iZAkPD5TDtwGTuCeylHmT8LSsjWPtf5iZCe9c4l2YcenCjZBYYbggPBx2K97J0LnpYmgY5v82AKokOAQ5tRzsoWoZAGa',
                'Content-Type': 'application/json'
            }
        }
    }
}