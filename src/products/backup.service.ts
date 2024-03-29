import * as dayjs from 'dayjs';
const { execute } = require('@getvim/execute');
import  * as compress from 'gzipme';
import * as fs from 'fs';
const schedule = require('node-schedule');
import { Injectable, Logger, OnModuleInit, ConsoleLogger } from '@nestjs/common';
// import * as execute from '@getvim/execute';

@Injectable()
export class BachpuDBService implements OnModuleInit {

    constructor(){}

    onModuleInit() {
        Logger.getTimestamp(); Logger.log('🐳🐳 log 🐳🐳 Se incia el modulo, en ese caso el servicio de backup 🐳🐳🐳🐳','LOG');
        Logger.getTimestamp(); Logger.error('🐳🐳 error 🐳🐳 Se incia el modulo, en ese caso el servicio de backup 🐳🐳🐳🐳','EROR');
        Logger.getTimestamp(); Logger.warn('🐳🐳 warn 🐳🐳 Se incia el modulo, en ese caso el servicio de backup 🐳🐳🐳🐳','WARN');
        Logger.getTimestamp(); Logger.verbose('🐳🐳 verbose 🐳🐳 Se incia el modulo, en ese caso el servicio de backup 🐳🐳🐳🐳','VERBOSE');
        Logger.getTimestamp(); Logger.debug('🐳🐳 debug 🐳🐳 Se incia el modulo, en ese caso el servicio de backup 🐳🐳🐳🐳','DEBUG',Logger.getTimestamp());
        
        const job = schedule.scheduleJob('0 3 * * *', () => this.startSchedule());
    }


    // getting db connection parameters from environment file
    dbusername = process.env.DB_USER_PLANNER_PROD;
    dbdatabase = process.env.DB_NAME_PLANNER_PROD;
    dbHost = process.env.DB_HOST_PLANNER_PROD;
    dbPort = process.env.DB_PORT_PLANNER_PROD;
    dbpass = process.env.PGPASS;

    // defining backup file name
    // date = new Date();
    // year = this.date.getFullYear();
    // month = this.date.getMonth()+1;
    // day = this.date.getDate();
    date_backup = dayjs().format("YYYY-MM-DD");
    // today = this.year+'-'+this.month+'-'+this.day;
    backupFileName= `pg-backup-${this.dbdatabase}-${this.date_backup}.sql`;
    fileNameGzip = `${this.backupFileName}.tar.gz`;

    takePGBackup() {

        let dateschedule = dayjs().format("YYYY-MM-DD HH:mm");
        Logger.getTimestamp(); Logger.log('Ingresa a la funcion de backup: ', dateschedule); 
        
        // pg_dump -U ${this.dbusername} -h ${this.dbHost} -p ${this.dbPort} -F p -d ${this.dbdatabase} > ${this.backupFileName}
        // execute(`pg_dump -U ${this.dbusername} -h ${this.dbHost} -p ${this.dbPort} -f ${this.backupFileName} -F p -d ${this.dbdatabase}`)
        // pg_dump -d postgres://${this.dbusername}:${this.dbpass}@${this.dbHost}:${this.dbPort}/${this.dbdatabase} > D:pruebarender.sql
        // execute(`mkdir db-backup`)
        //     .then( async () => {
        //         // add these lines to compress the backup file
        //         // await compress(this.backupFileName);
        //         // fs.unlinkSync(this.backupFileName);
        //         console.log("file for backup created");
        //     })
        //     .catch( (err) => {
        //     console.log(err);
        //     });
        
        // execute(`touch db-backup/${this.backupFileName}`)
        //     .then( async () => {
        //         // add these lines to compress the backup file
        //         // await compress(this.backupFileName);
        //         // fs.unlinkSync(this.backupFileName);
        //         console.log("file for backup created");
        //     })
        //     .catch( (err) => {
        //     console.log(err);
        //     });

        // execute(`pg_dump -d postgres://${this.dbusername}:${this.dbpass}@${this.dbHost}:${this.dbPort}/${this.dbdatabase} -f db-backup/${this.backupFileName}`)
        //     .then( async () => {
        //         // add these lines to compress the backup file
        //         // await compress(this.backupFileName);
        //         // fs.unlinkSync(this.backupFileName);
        //         console.log("backup created");
        //     })
        //     .catch( (err) => {
        //     console.log(err);
        //     });
    
        this.sendToBackupServer();

    }

    takePGRestore() {
        // execute(`pg_restore -cC -d ${this.dbdatabase} ${this.fileNameGzip}`)
        //     .then(async ()=> {
        //         console.log("Restored");
        //     }).catch(err=> {
        //     console.log(err);
        // })
    }

    sendToBackupServer(FileName:string = this.fileNameGzip) {
        console.log('Ingresa a la funcion de enviar el backup a un servidor de archivo', FileName);
        // const form = new FormData();
        // form.append('file', fileName);
        // axios.post('http://my.backupserver.org/private', form, {
        //     headers: form.getHeaders(),
        // }).then(result => {
        //     // Handle result…
        //     console.log(result.data);
        //     fs.unlinkSync(fileNameGzip);
        // }).catch(err => {
        //     // log error, send it to sentry... etc
        //     console.error(err);
        // });
    }

    startSchedule() {
       
        this.takePGBackup();
       
    }
}