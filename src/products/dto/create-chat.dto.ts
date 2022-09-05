import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
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

}
