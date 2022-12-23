import {  IsNumber, IsOptional, IsString, MinLength } from 'class-validator';


export class CreateApiWSDto {
    
    @IsString()
    @MinLength(5)
    slug_businnes: string;
    
    @IsString()
    @IsOptional()
    id_api_ws: string;

    @IsString()
    @IsOptional()
    type_app?: string;

    @IsString()
    @IsOptional()
    ver_app?: string;
    
    @IsString()
    @IsOptional()
    token_app?: string;

    @IsString()
    @IsOptional()
    phone_api: string;

    @IsString()
    @IsOptional()
    id_phone_app?: string; 

    @IsString()
    @IsOptional()
    id_cuenta_businnes?: string; 

    @IsString()
    @IsOptional()
    time_zone?: string; 

    @IsString()
    @IsOptional()
    utc_gmt?: string; 

    @IsString()
    @IsOptional()
    create_data?: string; 

    @IsNumber()
    @IsOptional()
    update_data?: string; 
}
