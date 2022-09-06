import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: true
    })
    text: string;

    @Column({
        type: 'text',
        nullable: true
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    type: string;

    @Column({
        type: 'text',
        nullable: true
    })
    payload?: string;

    @Column({
        type: 'text',
        nullable: true
    })
    timestamp: string;

    @Column({
        type: 'text',
        nullable: true
    })
    watsapp_id: string;

    @Column({
        type: 'text',
        nullable: true
    })
    from: string;

    @Column({
        type: 'text',
        nullable: true
    })
    phone_number_id: string;
    
}