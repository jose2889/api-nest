import { Injectable } from "@nestjs/common";
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return {
            headers: {
                'Authorization': 'Bearer EAAFhJR9LU3QBAFUpCu0AZBjOmUZAAAMbqgyopAifmKahljkzgemDWeaPErRLzChZBgzCoZAVglOuJtxdvxC5FZALf6T4arEU7EYigMKmT9bSxFhNwwWneFZAeZA2FvM84AkgtA4i43AZCCEBNs9QasXmaUtGqZCPWjkZAiGXFi7AEqWWBDXnnUTC2j',
                'Content-Type': 'application/json'
            }
        }
    }
}