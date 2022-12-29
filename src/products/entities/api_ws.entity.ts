import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: 'apis_ws'})
export class ApiWs{

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Product ID',
        uniqueItems: true
    })

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique:true,
    })
    slug_business: string;

    @Column({
        type: 'text',
        nullable: true
    })
    business_name: string;

    @Column({
        type: 'text',
        unique:false,
        nullable: true
    })
    id_api_ws: string;

    @Column({
        type: 'text',
        nullable: true
    })
    type_app: string;

    @Column({
        type: 'text',
        nullable: true
    })
    ver_app: string;

    @Column({
        type: 'text',
        unique:false,
        nullable: true
    })
    token_app?: string;

    @Column({
        type: 'text',
        unique:false,
        nullable: true
    })
    phone_api: string;

    @Column({
        type: 'text',
        unique:false,
        nullable: true
    })
    id_phone_app: string;

    @Column({
        type: 'text',
        unique:false,
        nullable: true
    })
    id_cuenta_business: string;

    @Column({
        type: 'text',
        nullable: true,
        unique:false
    })
    time_zone: string;

    @Column({
        type: 'text',
        nullable: true,
        unique:false
    })
    country_business: string;

    @Column({
        type: 'integer',
        nullable: true,
        unique:false
    })
    utc_gmt: number;

    @Column({
        type: 'bigint',
        unique:false
    })
    create_data: number;

    @Column({
        type: 'bigint', 
        nullable: true
    })
    update_data: number;

}