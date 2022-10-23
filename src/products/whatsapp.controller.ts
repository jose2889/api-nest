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

@ApiTags('Chats')
@Controller('chat')
export class WhatsappController {
  constructor(private readonly chatService: WhatsappService) {}
  
  // @Post()
  // create(@Body() createProductDto: CreateChatDto) {
  //   return this.chatService.create(createProductDto);
  // }

  @ApiResponse({ status: 201, description: 'Creado con éxito.'  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Post('notificationsws')
  notificationsWhatsapp(@Body() request: CreateNotificationDto, @Res() response) {
    
    const { phoneNumber, slug, date, businessName} = request; 
    console.log('#############Request############:', request);
    console.log('#############Slug############:', request.slug);
    
    let templateWhatsappApiRequest:WhatsappCloudApiRequest;
        templateWhatsappApiRequest = dataNotificationApiRequest;

        templateWhatsappApiRequest.template.name = "notificacion_reserva_cliente"; 
        templateWhatsappApiRequest.to = phoneNumber;
        templateWhatsappApiRequest.template.components[0].parameters[0].text = date;
        templateWhatsappApiRequest.template.components[0].parameters[1].text = businessName;   
        templateWhatsappApiRequest.template.components[1].parameters[0].text = slug;//.slice(1);   

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
     
      const { phoneNumber, customerName, date, businessName, confirmToken, cancelToken} = request; 
      let templateWhatsappApiRequest:WhatsappCloudApiRequest;
      templateWhatsappApiRequest = dataApiRequest;
          
      templateWhatsappApiRequest.template.name = "confirmation_reservation"; // "confirmacion_reserva"; 
      templateWhatsappApiRequest.to = phoneNumber;
      templateWhatsappApiRequest.template.components[0].parameters[0].text = customerName;
      templateWhatsappApiRequest.template.components[0].parameters[1].text = date;
      templateWhatsappApiRequest.template.components[0].parameters[2].text = businessName;   
      templateWhatsappApiRequest.template.components[1].parameters[0].payload = confirmToken;   
      templateWhatsappApiRequest.template.components[2].parameters[0].payload = cancelToken;   
      console.log("wsApiReques ", dataApiRequest);

      this.chatService.sendMessage(templateWhatsappApiRequest).then( res => {
          response.status(HttpStatus.CREATED).json(res);
      }).catch((err) => {
          response.status(HttpStatus.BAD_REQUEST).json(err);
      })
  }

 
  // @Get()
  // findAll( @Query() paginationDto:PaginationDto ) {
  //   // console.log(paginationDto)
  //   return this.chatService.findAll( paginationDto );
  // }


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
