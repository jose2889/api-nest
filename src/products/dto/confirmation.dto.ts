import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';

export class CreateConfirmationDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    customerName: string;

    @ApiProperty()
    @MinLength(1)
    @IsString()
    date: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    businessName: string;
    
    @ApiProperty()
    @IsString()
    @MinLength(1)
    confirmToken: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    cancelToken: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    phoneNumber: string; 

}
