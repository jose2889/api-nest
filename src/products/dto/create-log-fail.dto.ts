import {  IsOptional, IsString, MinLength } from 'class-validator';


export class CreateLogFailDto {
    
    @IsString()
    @IsOptional()
    retcode?: string;
    
    @IsString()
    @IsOptional()
    status_code?: string;

    @IsString()
    @IsOptional()
    token?: string;

    @IsString()
    @IsOptional()
    phone_number?: string; 

    @IsString()
    @IsOptional()
    status_text?: string; 

    @IsString()
    @IsOptional()
    config_method?: string;

    @IsString()
    @IsOptional()
    config_data?: string;

    @IsString()
    @IsOptional()
    config_url?: string;

    @IsString()
    @IsOptional()
    create_data?: string;
}
