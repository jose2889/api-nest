import { Timestamp } from 'typeorm';
import { IsArray, IsBoolean, IsDate, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';


export class CreateSendTemplateDto {

    @IsString()
    @MinLength(1)
    to_phone: string;

    @IsString()
    @IsOptional()
    customer_name:string

    @IsString()
    @IsOptional()
    template?: string;
    
    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    name_business?: string;

    @IsString()
    @IsOptional()
    watsapp_id: string;

    @IsNumber()
    @IsOptional()
    timestamp?: number; 

    @IsString()
    @IsOptional()
    token_confirm?: string; 

    @IsString()
    @IsOptional()
    token_cancel?: string;

    @IsString()
    @IsOptional()
    created_at: string;

}
