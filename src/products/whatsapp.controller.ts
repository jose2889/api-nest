import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ForbiddenException, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
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
  constructor(private readonly chatService: WhatsappService) {}

  // @Post()
  // create(@Body() createProductDto: CreateChatDto) {
  //   return this.chatService.create(createProductDto);
  // }

  // ############################### Endpoints para el consumo de la API de Whatsapp Cloud #####################################

  @ApiResponse({ status: 201, description: 'Creado con éxito.'  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Post('notificationsws')
  notificationsWhatsapp(@Body() request: CreateNotificationDto, @Res() response) {
     
    const { phoneNumber, slug, date, businessName} = request; 
    // console.log('############# Templete notification ############:', process.env.TEMPLATE_RESERVATION_NOTIFICATION);

    let first_chart=slug.slice(0, 1);
    
    let templateWhatsappApiRequest:WhatsappCloudApiRequest;
        templateWhatsappApiRequest = dataNotificationApiRequest;

        templateWhatsappApiRequest.template.name = process.env.TEMPLATE_RESERVATION_NOTIFICATION;//"notification_reservation_keoagenda";//"notification_reservation_client";//"notificacion_reservacion_cliente"; 
        templateWhatsappApiRequest.to = phoneNumber;
        templateWhatsappApiRequest.template.components[0].parameters[0].text = date;
        templateWhatsappApiRequest.template.components[0].parameters[1].text = businessName;   
        templateWhatsappApiRequest.template.components[1].parameters[0].text = ( first_chart == '/') ? slug.slice(1) : slug; //slug;  // con el slice quitamos el #( primer caracter ) del slug

      this.chatService.sendMessage(templateWhatsappApiRequest).then( res => {
          response.status(HttpStatus.CREATED).json(res);
      }).catch((err) => {
          response.status(HttpStatus.BAD_REQUEST).json(err);
      })
  }

  @ApiResponse({ status: 201, description: 'Creado con éxito.'  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Post('confirmationsws')
  confirmationsWhatsapp(@Body() request: CreateConfirmationDto, @Res() response) {
      // this.logger.warn('consume-template');
      // console.log('############# Templete confirmation ############:', process.env.TEMPLATE_RESERVATION_CONFIRMATION);

      const { phoneNumber, customerName, date, businessName, confirmToken, cancelToken, slug} = request; 
      let templateWhatsappApiRequest:WhatsappCloudApiRequest;
      templateWhatsappApiRequest = dataApiRequest;
          
      templateWhatsappApiRequest.template.name = process.env.TEMPLATE_RESERVATION_CONFIRMATION;//"confirmation_reservation_keoagenda";
      templateWhatsappApiRequest.to = phoneNumber;
      templateWhatsappApiRequest.template.components[0].parameters[0].text = customerName;
      templateWhatsappApiRequest.template.components[0].parameters[1].text = date;
      templateWhatsappApiRequest.template.components[0].parameters[2].text = businessName;   
      templateWhatsappApiRequest.template.components[1].parameters[0].payload = confirmToken;   
      templateWhatsappApiRequest.template.components[2].parameters[0].payload = cancelToken;   
      // console.log("⏩⏩⏩⏩ Template: ", process.env.TEMPLATE_RESERVATION_CONFIRMATION);
      console.log("⏩⏩⏩⏩ wsApiReques: ", dataApiRequest);
      console.log("⏩⏩⏩⏩ Empresa: ", slug);
      this.chatService.sendMessage(templateWhatsappApiRequest).then( res => {
          response.status(HttpStatus.CREATED).json(res);
      }).catch((err) => {
          response.status(HttpStatus.BAD_REQUEST).json(err);
      })
  }
  // ###############################################################################################################################


  // ################### Creacion de  los endpoint de los listaos de los mensajes y de los registros de errores ##########################
  // ############################################################ Edgardo Lugo ###########################################################
  
  @Get('list-messages')
  findAll(@Query() paginationDto: PaginationDto) {
    console.log('🗒🗒 Se mostro listado de mensajes')
    return this.chatService.findAll(paginationDto);
  }

  @Get('length-messages')
  countMessages(@Query() paginationDto: PaginationDto) {
    //console.log(this.chatService.findLengthMessages())
    return this.chatService.findLengthMessages();
  }
  
  @Get('list-error')
  findAllError(@Query() paginationDto: PaginationDto) {
    console.log('🗒🗒 Se mostro listado de errores registrados en la base de datos');
    return this.chatService.findAllError(paginationDto);
  }

  @Get('list-error/:time')
  findOneError(@Param('time') time: number) {
    console.log('⌚⌚ Se mostrara los errores en las ultimas "', time, '" horas');
    return this.chatService.findError24(time);
  }
  
  @Get('length-error')
  countError(@Query() paginationDto: PaginationDto) {
    //console.log(this.chatService.findLengthMessages())
    return this.chatService.findLengthError();
  }

  // ######################################################################################################################################
  
  // ########################################### Creacion de  los endpoint para la getion de APIs Ws ######################################
  // #################################################### Edgardo Lugo ####################################################################

  @Post('business')
  createRegisterApiWsDB(@Body() createRegisterApiWs: CreateApiWSDto) {
    try {
      const res = this.chatService.CreateRegisterApiWs(createRegisterApiWs);
      console.log('📁📁💼💼 Se registro un nuevo negocio');
      response.status(HttpStatus.CREATED).json(res);
    } catch (err) {
      console.log('💩💩 Ocurrio un error al registrar negocio');
      response.status(HttpStatus.BAD_REQUEST).json(err);
    }

  }

  @Get('business')
  findAllbusiness(@Query() paginationDto: PaginationDto) {
    return this.chatService.findAllbusiness(paginationDto);
  }

  @Get('business/:term')
  findOnebusiness(@Param('term') term: string) {
    return this.chatService.findOnebusiness(term);
  }

  @Patch('business/:id')
  updatebusiness(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApiWsDto: UpdateApiWsDto,
  ) {
    return this.chatService.updatebusiness(id, updateApiWsDto);
  }

  @Delete('business/:id')
  removebusiness(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.removebusiness(id);
  }



  // ###################################################################################################################################

  // @Get(':term')
  // findOne(@Param( 'term' ) term: string) {
  //   return this.chatService.findOne( term );
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe ) id: string, 
  //   @Body() updateProductDto: UpdateChatDto
  // ) {
  //   return this.chatService.update( id, updateProductDto );
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe ) id: string) {
  //   return this.chatService.remove( id );
  // }
  
}
