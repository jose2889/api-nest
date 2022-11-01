import {  IsOptional, IsString, MinLength } from 'class-validator';


export class CreateLogFailDto {
    
    // @IsString()
    // @IsOptional()
    // error_response?: string;

    @IsString()
    @IsOptional()
    retcode?: string;
    
    @IsString()
    @IsOptional()
    status_code?: string;

    @IsString()
    @IsOptional()
    token: string;

    @IsString()
    @IsOptional()
    phone_number?: string; 

    @IsString()
    @IsOptional()
    status_text?: string; 

    @IsString()
    @IsOptional()
    create_data?: string;
}
