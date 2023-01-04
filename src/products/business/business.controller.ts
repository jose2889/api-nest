import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateApiWSDto } from '../dto/create-api-ws.dto';
import { UpdateApiWsDto } from '../dto/update-api-ws.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { response } from 'express';

@Controller('business')
export class BusinessController {
    BusinessService: any;

    constructor (){}


     
  // ########################################### Creacion de  los endpoint para la getion de APIs Ws ######################################
  // #################################################### Edgardo Lugo ####################################################################

  @Post('')
  createRegisterApiWsDB(@Body() createRegisterApiWs: CreateApiWSDto) {
    try {
      const res = this.BusinessService.CreateRegisterApiWs(createRegisterApiWs);
      console.log('📁📁💼💼 Se registro un nuevo negocio');
      response.status(HttpStatus.CREATED).json(res);
    } catch (err) {
      console.log('💩💩 Ocurrio un error al registrar negocio');
      response.status(HttpStatus.BAD_REQUEST).json(err);
    }

  }

  @Get('')
  findAllbusiness(@Query() paginationDto: PaginationDto) {
    return this.BusinessService.findAllbusiness(paginationDto);
  }

  @Get(':term')
  findOnebusiness(@Param('term') term: string) {
    return this.BusinessService.findOnebusiness(term);
  }

  @Patch(':id')
  updatebusiness(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApiWsDto: UpdateApiWsDto,
  ) {
    return this.BusinessService.updatebusiness(id, updateApiWsDto);
  }

  @Delete(':id')
  removebusiness(@Param('id', ParseUUIDPipe) id: string) {
    return this.BusinessService.removebusiness(id);
  }



  // ###################################################################################################################################
}
