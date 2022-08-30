import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
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
    timestamp: string;

    @Column({
        type: 'text',
        nullable: true
    })
    wa_id: string;

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