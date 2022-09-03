import { Injectable } from "@nestjs/common";
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return {
            headers: {
                'Authorization': 'Bearer EAAGvZCoWRtiUBAPa5QZCGgTIDjrggjzAN6BobdaLPwFXZCm2gh9Cj5L2eT4rvn7sHewEsphWArYIyWZALdgkgn0e7mdZAepEF0EhLepMGY5nscJAyt02C6vKON1wbrTtwrY9S243jmaP1ThIvD1BcZCfUiuqrCAZBVY2LUszimziXtKIGZASYrFzZCsTdtEK6kUrUDDetPEZAdeGRKbSyKcghZB',
                'Content-Type': 'application/json'
            }
        }
    }
}