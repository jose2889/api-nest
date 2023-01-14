import {  IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSystemConfigDto {
    
    @IsString()
    @IsOptional()
    development_environment:string;
    
    @IsString()
    @IsOptional()
    whatsapp_token:string;
    
    @IsString()
    @IsOptional()
    verify_token:string;
    
    @IsString()
    @IsOptional()
    url_planner:string;
    
    @IsString()
    @IsOptional()
    test_phone_number:string;
    
    @IsString()
    @IsOptional()
    template_reservation_notification:string;
    
    @IsString()
    @IsOptional()
    template_reservation_confirmation:string;
    
    @IsString()
    @IsOptional()
    template_budget:string;
    
    @IsString()
    @IsOptional()
    email_host:string;
    
    @IsNumber()
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
    
    @IsString()
    @IsOptional()
    pgsslmode:string;
    
    @IsString()
    @IsOptional()
    db_username:string;
    
    @IsNumber()
    @IsOptional()
    db_port:number;    
    
    @IsString()
    @IsOptional()
    db_password:string;
    
    @IsString()
    @IsOptional()
    db_name:string;
    
    @IsString()
    @IsOptional()
    db_host:string;
    
    @IsString()
    @IsOptional()
    database_url:string;
    
    @IsString()
    @IsOptional()
    base_url_prod:string;

    @IsNumber()
    @IsOptional()
    timestamp: number;
    
    @IsNumber()
    @IsOptional()
    create_data: number;
    
    @IsNumber()
    @IsOptional()
    update_data: number;

}
