import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {BachpuDBService} from './backup.service';



@Controller('backup')
export class BackupDBController {
    constructor(private readonly backupDB: BachpuDBService) {}

    // @Get('manual')
    // findAll(@Query() paginationDto: PaginationDto) {
    //     console.log('🗒🗒 Se mostro listado de mensajes')
    //     return this.chatService.findAll(paginationDto);
    // }

    // @Post('manual')
    // createRegisterApiWsDB(@Body() backupDB:BachpuDBdto ) {
    //     try {
    //     const res = this.backupDB.CreateRegisterApiWs(createRegisterApiWs);
    //     console.log('📁📁💼💼 Se registro un nuevo negocio');
    //     response.status(HttpStatus.CREATED).json(res);
    //     } catch (err) {
    //     console.log('💩💩 Ocurrio un error al registrar negocio');
    //     response.status(HttpStatus.BAD_REQUEST).json(err);
    //     }

    // }


}