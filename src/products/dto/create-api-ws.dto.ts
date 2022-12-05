import {  IsOptional, IsString, MinLength } from 'class-validator';


export class CreateApiWSDto {
    
    @IsString()
    @MinLength(1)
    slug_businnes: string;
    
    @IsString()
    @MinLength(1)
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
    id_cuenta_business?: string; 

    @IsString()
    @IsOptional()
    create_data?: string; 

    @IsString()
    @IsOptional()
    update_data?: string; 
}
