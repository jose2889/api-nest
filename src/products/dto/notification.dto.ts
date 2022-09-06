import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';

export class CreateNotificationDto {

    @ApiProperty({
        example: 'Roslin SPA',
        description: 'Nombre del Negocio',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    businessName: string;

    @ApiProperty({
        example: 'business/roslin-spa',
        description: 'Nombre slug del negocio con el prefijo business',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    slug: string;

    @ApiProperty({
        example: '12-09-2022 a las 10:45',
        description: 'Fecha de la reserva',
    })
    @ApiProperty()
    @MinLength(1)
    @IsString()
    date: string;

    @ApiProperty({
        example: '56957858732',
        description: 'Número de whatsapp del cliente',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    phoneNumber: string; 

}
