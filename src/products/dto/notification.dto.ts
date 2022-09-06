import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';

export class CreateNotificationDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    slug: string;

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
    phoneNumber: string; 

}
