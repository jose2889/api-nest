import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: 'log_fail'})
export class LogFail{

    

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({
    //     type: 'text',
    //     unique:true,
    // })
    // error_response: string;

    @Column({
        type: 'text',
        unique:true
    })
    retcode: string;

    @Column({
        type: 'text'
    })
    status_code: string;

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
    status_text: string;

    @Column({
        type: 'text',
        unique:true
    })
    create_data: string;

}