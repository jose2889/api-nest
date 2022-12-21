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
    slug_businnes: string;

    @Column({
        type: 'text',
        unique:true
    })
    id_api_ws: string;

    @Column({
        type: 'text'
    })
    type_app: string;

    @Column({
        type: 'text'
    })
    ver_app: string;

    @Column({
        type: 'text',
        unique:true
    })
    token_app?: string;

    @Column({
        type: 'text',
        unique:true
    })
    phone_api: string;

    @Column({
        type: 'text',
        unique:true
    })
    id_phone_app: string;

    @Column({
        type: 'text',
        unique:true
    })
    id_cuenta_business: string;

    @Column({
        type: 'text',
        unique:true
    })
    create_data: string;

    @Column({
        type: 'text', 
        nullable: true
    })
    update_data: string;

}