import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

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
    @Index()
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
    
    @Column({
        type: 'bool',
        default: false,
        nullable: true
    })
    answered_message: boolean;

    @Column({
        type: 'text',
        nullable: true
    })
    status_response_api: string;

    @Column({
        type: 'text',
        nullable: true
    })
    context_id_wa_msg: string;

    @Column({
        type: 'text',
        nullable: true
    })
    response_msg: string;

    @Column({
        type: 'text',
        nullable: true
    })
    body_request: string;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    @Index()
    created_at:string;   
}