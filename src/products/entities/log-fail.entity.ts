import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: 'log_fail'})
export class LogFail{

    

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
    })
    response: string;

    @Column({
        type: 'text'
    })
    status_code: string;

    @Column({
        type: 'text'
    })
    status_text: string;

    @Column({
        type: 'text'
    })
    token: string;
    
    @Column({
        type: 'text'
    })
    phone_number: string;

    @Column({
        type: 'text'
    })
    text_message: string;

    @Column({
        type: 'text'
    })
    config_method: string;

    @Column({
        type: 'text'
    })
    config_data: string;
    
    @Column({
        type: 'text',
        unique:true
    })
    create_data: string;

}