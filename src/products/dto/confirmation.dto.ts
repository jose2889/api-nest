import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';

export class CreateConfirmationDto {

    @ApiProperty({
        example: 'Carlos Lopez',
        description: 'Nombre del cliente',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    customerName: string;

    @ApiProperty({
        example: '12-09-2022 a las 10:45',
        description: 'Fecha de la reserva',
    })
    @ApiProperty()
    @MinLength(1)
    @IsString()
    date: string;

    @ApiProperty({
        example: 'Roslin SPA',
        description: 'Nombre del Negocio',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    businessName: string;
    
    @ApiProperty({
        example: 'ac4a596180c08d5b4a025e14a871fb440e47c325ef07ff20f2b56ef2f029d3c3',
        description: 'Token para confirmar cita',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    confirmToken: string;

    @ApiProperty({
        example: 'e2d2319bd4d76175270ee0c8925999bd44d745f9693eff264453c6b243f5e267',
        description: 'Token para cancelar cita',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    cancelToken: string;

    @ApiProperty({
        example: '56957858732',
        description: 'Número de whatsapp del cliente',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    phoneNumber: string; 

    @ApiProperty({
        example: 'business/roslin-spa',
        description: 'Nombre slug del negocio con el prefijo business',
    })
    @ApiProperty()
    @IsString()
    @MinLength(1)
    slug: string;
}
