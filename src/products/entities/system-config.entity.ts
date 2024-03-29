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
    kf_id_api_ws:string;

    @Column({
        type: 'text',
        nullable: true
    })
    kf_id_email_config:string;
    
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
