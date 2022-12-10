import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ForbiddenException, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { WhatsappCloudAPIRequest, WhatsappConfimationRequest } from './dto/whatsapp-cloud-api-request.dto';
import { dataApiRequest, dataNotificationApiRequest, WhatsappCloudApiRequest } from 'src/common/whatsapp-cloud-api-request.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateConfirmationDto } from './dto/confirmation.dto';
import { CreateNotificationDto } from './dto/notification.dto';
import { CreateApiWSDto } from './dto/create-api-ws.dto';
import { response } from 'express';
import { UpdateApiWsDto } from './dto/update-api-ws.dto';

@ApiTags('Chats')
@Controller('chat')
export class WhatsappController {
  constructor(private readonly chatService: WhatsappService) { }

  // @Post()
  // create(@Body() createProductDto: CreateChatDto) {
  //   return this.chatService.create(createProductDto);
  // }

  @ApiResponse({ status: 201, description: 'Creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Post('notificationsws')
  notificationsWhatsapp(@Body() request: CreateNotificationDto, @Res() response) {

    const { phoneNumber, slug, date, businessName } = request;
    // console.log('############# Templete notification ############:', process.env.TEMPLATE_RESERVATION_NOTIFICATION);

    let first_chart = slug.slice(0, 1);

    let templateWhatsappApiRequest: WhatsappCloudApiRequest;
    templateWhatsappApiRequest = dataNotificationApiRequest;

    templateWhatsappApiRequest.template.name = process.env.TEMPLATE_RESERVATION_NOTIFICATION;//"notification_reservation_keoagenda";//"notification_reservation_client";//"notificacion_reservacion_cliente"; 
    templateWhatsappApiRequest.to = phoneNumber;
    templateWhatsappApiRequest.template.components[0].parameters[0].text = date;
    templateWhatsappApiRequest.template.components[0].parameters[1].text = businessName;
    templateWhatsappApiRequest.template.components[1].parameters[0].text = (first_chart == '/') ? slug.slice(1) : slug; //slug;  // con el slice quitamos el #( primer caracter ) del slug

    this.chatService.sendMessage(templateWhatsappApiRequest).then(res => {
      response.status(HttpStatus.CREATED).json(res);
    }).catch((err) => {
      response.status(HttpStatus.BAD_REQUEST).json(err);
    })
  }

  @ApiResponse({ status: 201, description: 'Creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Post('confirmationsws')
  confirmationsWhatsapp(@Body() request: CreateConfirmationDto, @Res() response) {
    // this.logger.warn('consume-template');
    // console.log('############# Templete confirmation ############:', process.env.TEMPLATE_RESERVATION_CONFIRMATION);

    const { phoneNumber, customerName, date, businessName, confirmToken, cancelToken, slug } = request;
    let templateWhatsappApiRequest: WhatsappCloudApiRequest;
    templateWhatsappApiRequest = dataApiRequest;

    templateWhatsappApiRequest.template.name = process.env.TEMPLATE_RESERVATION_CONFIRMATION;//"confirmation_reservation_keoagenda";
    templateWhatsappApiRequest.to = phoneNumber;
    templateWhatsappApiRequest.template.components[0].parameters[0].text = customerName;
    templateWhatsappApiRequest.template.components[0].parameters[1].text = date;
    templateWhatsappApiRequest.template.components[0].parameters[2].text = businessName;
    templateWhatsappApiRequest.template.components[1].parameters[0].payload = confirmToken;
    templateWhatsappApiRequest.template.components[2].parameters[0].payload = cancelToken;
    console.log("wsApiReques ", dataApiRequest);
    console.log("link para reagendar ", slug);
    this.chatService.sendMessage(templateWhatsappApiRequest).then(res => {
      response.status(HttpStatus.CREATED).json(res);
    }).catch((err) => {
      response.status(HttpStatus.BAD_REQUEST).json(err);
    })
  }

  // ################### Creacion de  los endpoint para la getion de APIs Ws ##########################
  // ######################################## Edgardo Lugo ############################################

  @Get('list-messages')
  findAll(@Query() paginationDto: PaginationDto) {
    console.log('Se mostro listado de mensajes')
    return this.chatService.findAll(paginationDto);
  }

  @Get('length-messages')
  count(@Query() paginationDto: PaginationDto) {
    //console.log(this.chatService.findLengthMessages())
    return this.chatService.findLengthMessages();
  }

  @Get('list-error')
  findAllError(@Query() paginationDto: PaginationDto) {
    console.log('Se mostro listado de errores registrados en la base de datos');
    return this.chatService.findAllError(paginationDto);
  }

  @Post('businne')
  createRegisterApiWsDB(@Body() createRegisterApiWs: CreateApiWSDto) {
    return this.chatService.CreateRegisterApiWs(createRegisterApiWs).then(res => {
      console.log('Se registro un nuevo negocio');
      response.status(HttpStatus.CREATED).json(res);
    }).catch((err) => {
      console.log('Ocurrio un error al registrar negocio');
      response.status(HttpStatus.BAD_REQUEST).json(err);
    });

  }

  @Get('businne')
  findAllBusinnes(@Query() paginationDto: PaginationDto) {
    return this.chatService.findAllBusinnes(paginationDto);
  }

  @Get('businne/:term')
  findOneBusinnes(@Param('term') term: string) {
    return this.chatService.findOneBusinnes(term);
  }

  @Patch('businne/:id')
  updateBusinnes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApiWsDto: UpdateApiWsDto,
  ) {
    return this.chatService.updateBusinnes(id, updateApiWsDto);
  }

  @Delete('businne/:id')
  removeBusinnes(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.removeBusinnes(id);
  }

}

  // ###################################################################################