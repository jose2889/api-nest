import {  IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSystemConfigDto {
    
    @IsString()
    @IsOptional()
    development_environment:string;
    
    @IsString()
    @IsOptional()
    verify_token:string;
    
    @IsString()
    @IsOptional()
    url_planner:string;
    
    @IsString()
    @IsOptional()
    kf_id_email_confi:string;
    
    @IsNumber()
    @IsOptional()
    kf_id_api_ws:number;
    
    @IsNumber()
    @IsOptional()
    create_data: number;
    
    @IsNumber()
    @IsOptional()
    update_data: number;

}
