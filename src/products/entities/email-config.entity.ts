import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_config')
export class EmailConfigEntity {
    @PrimaryGeneratedColumn() id:string;

    @Column({
        type: 'text',
        nullable: true
    })
    email_host:string;
    
    @Column({
        type: 'numeric',
        nullable: true
    })
    email_port:number;
    
    @Column({
        type: 'text',
        nullable: true
    })
    email_security:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    email_useremail:string;
        
    @Column({
        type: 'text',
        nullable: true
    })
    email_password:string;
        
    @Column({
        type: 'text',
        nullable: true
    })
    email_to:string;
    
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
