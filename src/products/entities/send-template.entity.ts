import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()

export class SendTemplate {

    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: true
    })
    to_phone: string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    customer_name:string;

    @Column({
        type: 'text',
        nullable: true
    })
    name_business: string;

    @Column({
        type: 'text',
        nullable: true
    })
    type: string;

    @Column({
        type: 'text',
        nullable: true
    })
    date: string;

    @Column({
        type: 'text',
        nullable: true
    })
    template?: string;

    @Column({
        type: 'numeric',
        nullable: true
    })
    timestamp: number;

    @Column({
        type: 'text',
        nullable: true
    })
    watsapp_id: string;

    @Column({
        type: 'text',
        nullable: true
    })
    slug: string;

    @Column({
        type: 'text',
        nullable: true
    })
    token_confirm: string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    token_cancel: string;

}

