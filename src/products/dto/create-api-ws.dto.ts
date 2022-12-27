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

    @IsNumber()
    @IsOptional()
    utc_gmt?: number; 

    @IsNumber()
    @IsOptional()
    create_data?: number; 

    @IsNumber()
    @IsOptional()
    update_data?: number; 
}
