import {  IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmailConfigDto {
    
    @IsString()
    @IsOptional()
    email_host:string;
    
    @IsString()
    @IsOptional()
    email_port:number;
    
    @IsString()
    @IsOptional()
    email_security:string;
    
    @IsString()
    @IsOptional()
    email_useremail:string;
    
    @IsString()
    @IsOptional()
    email_password:string;
    
    @IsString()
    @IsOptional()
    email_to:string;
    
    @IsNumber()
    @IsOptional()
    create_data: number;
    
    @IsNumber()
    @IsOptional()
    update_data: number;


}
