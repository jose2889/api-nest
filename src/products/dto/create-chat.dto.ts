import { Timestamp } from 'typeorm';
import { IsArray, IsBoolean, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';


export class CreateChatDto {

    @IsString()
    @MinLength(1)
    text: string;

    @IsString()
    @IsOptional()
    from?: string;

    @IsString()
    @IsOptional()
    payload?: string;
    
    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    watsapp_id: string;

    @IsString()
    @IsOptional()
    name?: string; 

    @IsString()
    @IsOptional()
    timestamp?: string; 

    @IsString()
    @IsOptional()
    phone_number_id?: string; 

    @IsString()
    @IsOptional()
    status_response_api: string;

    @IsString()
    @IsOptional()
    response_msg: string;

    @IsString()
    @IsOptional()
    body_request: string;

    @IsString()
    @IsOptional()
    context_id_wa_msg:string;

    @IsBoolean()
    @IsOptional()
    answered_message?: boolean;

    // @IsString()
    @IsOptional()
    created_at:any;
}
