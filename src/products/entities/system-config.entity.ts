import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_config')
export class SystemConfigEntity {
    @PrimaryGeneratedColumn() id:string;
    
    @Column({
        type: 'text',
        nullable: true,
    })
    development_environment:string;

    @Column({
        type: 'text',
        nullable: true
    })
    whatsapp_token:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    verify_token:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    url_planner:string;
        
    @Column({
        type: 'text',
        nullable: true
    })
    template_reservation_notification:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    template_reservation_confirmation:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    template_budget:string;
    
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
        type: 'text',
        nullable: true
    })
    pgsslmode:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    db_username:string;
    
    @Column({
        type: 'numeric',
        nullable: true
    })
    db_port:number
    
    @Column({
        type: 'text',
        nullable: true
    })
    db_password:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    db_name:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    db_host:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    database_url:string;
    
    @Column({
        type: 'text',
        nullable: true
    })
    base_url_prod:string;
    
    @Column({
        type: 'bigint',
        nullable: true
    })
    timestamp: number;

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
