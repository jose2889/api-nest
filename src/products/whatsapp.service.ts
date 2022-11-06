import { CreateApiWSDto } from './dto/create-api-ws.dto';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateLogFailDto } from './dto/create-log-fail.dto';

import { Chat } from './entities/chat.entity';
import { validate as isUUID } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { WhatsappCloudApiRequest } from 'src/common/whatsapp-cloud-api-request.dto';
import { WhatsappCloudAPIResponse } from 'src/common/whatsapp-cloud-api-response.dto';
import { BASEURL } from 'src/common/api-resource';
import { AxiosResponse } from 'axios'
import * as dayjs from 'dayjs'
import { Apiws } from './entities/api_ws.entity';
import { LogFail } from './entities/log-fail.entity';


@Injectable()
export class WhatsappService {

  private readonly logger = new Logger('WhatsappService');
  baseUrl = process.env.BASE_URL_PROD; //BASEURL.baseUrlWhatsappCloudApiProd;
  urlPlanner = process.env.URLPLANNER; 
  
  // date = dayjs(1662237384 * 1000).format("YYYY-MM-DD HH:mm");

  request = {
    "messaging_product": "whatsapp",
    "preview_url": true,
    "recipient_type": "individual",
    "to": "56957858732",
    "type": "text",
    "text": {
        "body": "para mensajes"
    }
  }

  constructor(

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly httpService:HttpService,
    @InjectRepository(Apiws)
    private readonly apiWsRepository: Repository<Apiws>, //variable para regsitar API Ws
    @InjectRepository(LogFail)
    private readonly logFailRepository: Repository<LogFail>, //variable para regsitar API Ws

  ) {}

// ################# Guardado de los datos en la tabla de las APIs Ws###################
// ############################### Edgardo Lugo ########################################

  async CreateRegisterApiWs(createApiWsDot:CreateApiWSDto){
    try {
      const apiWs = this.apiWsRepository.create(createApiWsDot);
      apiWs.create_data = Date.now().toString();
      await this.apiWsRepository.save(apiWs);
      console.log(apiWs);
      return {apiWs};
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  //###################################################################################


  // ############# Guardado de los datos en la tabla de las Error Response#############
  // ############################### Edgardo Lugo #####################################

  async CreateRegisterLogFail(createLogFaileDto:CreateLogFailDto){
    try {
      console.log('Ingresa a guardar error');
      const logFail = this.logFailRepository.create(createLogFaileDto);
      logFail.create_data = Date.now().toString();
      await this.logFailRepository.save(logFail);
      console.log('Datos guardados: ',logFail);
      return true;
    } catch (error) {
      this.handleDBExceptions(error)
      return false;
    }
  }

  //###################################################################################

  async sendMessage(request: WhatsappCloudApiRequest): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(this.httpService.post(this.baseUrl, request));
    console.log(data);
    return data;
  }

  async updateReservation(token: string, phone_number: string): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {

    console.log("token recibido ", token);
    this.request.to = phone_number;
    let body = {
      date: dayjs().format("YYYY-MM-DD HH:mm")
    }
    console.log("body ", body);
    let data; 
  
     try {
      this.httpService.put(`${this.urlPlanner}${token}`, body).subscribe(data =>{
        console.log("########### Respuesta exitosa de planner", data.statusText);
        // console.log("cuerpo de la respuesta", data.data);
        let retMessage = data.data.retMessage;
        console.log("########### retMessage", retMessage);

        if (data.statusText === "OK" && retMessage === "1") {
          this.request.text.body = "Su reserva ha sido confirmada con éxito. Gracias por su respuesta.";
          console.log("########### Respuesta de planner OK: Accept => ",token);

        }

        if (data.statusText === "OK" && retMessage === "3") {
          this.request.text.body = "Su reserva ha sido cancelada con éxito. Gracias por su respuesta.";
          console.log("########### Respuesta de planner OK: Cancel => ",token);
        }

        // if (data.statusText === "Not Acceptable"){
        //   this.request.text.body = "Su reserva no ha sido procesada.";
        //   console.log("respuesta de planner Not Acceptable: Token => ", token , "Status: ", data.status);
        // }

        this.httpService.post(this.baseUrl, this.request).subscribe(res => {
          console.log("########### Respuesta exitosa del whatsapp", res.statusText); 
        },
        (error) => {
          console.log("########### Ocurrio un error al enviar el mensaje por whatsapp ", error);
        }); 
      },
      async (error) => {
        let errorResponse = error.response;
        // console.log("ocurrio un error en la respuesta de planner y no se cancelo", JSON.stringify(errorResponse));
        console.log("###################### Error de solicitud ###################### ");
        
        if (error.response.statusText === "Not Acceptable"){
          this.request.text.body = "Su reserva no ha sido procesada. Por favor contacte con el personal de keoPlanner";
          console.log("######## Error de solicitud! Not Acceptable: Token => ", token);
        } else {
          this.request.text.body = "Gracias por su respuesta, a la brevedad pronto sera contactado."
        }
        
        console.log("######## Status: ", errorResponse.status.toString());
        console.log("######## Data: ", JSON.stringify(errorResponse.data));
        console.log("######## Status Text: ",errorResponse.statusText);
        console.log("######## ConfigMethod: ",errorResponse.config.method);
        console.log("######## ConfigURL: ",errorResponse.config.url);
        console.log("######## ConfigData: (body date) ", errorResponse.config.data.date);

        // *************************************************
        const logFail = {
          status_code: errorResponse.status.toString(),
          status_text: errorResponse.statusText,
          retcode: data.data.retCode.toString(),
          token: token,
          phone_number: phone_number.toString(),
          config_method: errorResponse.config.method,
        }
        console.log('Datos a guardar en la tabla: ', logFail);
        await this.CreateRegisterLogFail(logFail);
        // *************************************************

        // this.request.text.body = "Gracias por su respuesta, a la brevedad pronto sera contactado."
        this.httpService.post(this.baseUrl, this.request).subscribe(res => {
          console.log("respuesta exitosa del whatsapp", res.statusText); 
        },
        (eror) => {
          console.log("ocurrio un error al enviar el mensaje por whatsapp ", error);
        }); 
      });
      // console.log("Response de planner", data);
    } catch (error) {
        throw new BadRequestException();
    }
    
    // if (data.retCode === "1"){
    //   this.request.text.body = "Su reserva ha sido procesada con éxito. Gracias por su respuesta.";
    // }else if (data.retCode === "1"){
    //   if (data.retMessage === "1") {
    //     this.request.text.body = "La reservación ya se encuentra aprobada previamente.";
    //   } else if (data.retMessage === "3") {
    //     this.request.text.body = "La reservación ya ha sido cancelada previamente.";
    //   } else if (data.retMessage === "9") {
    //     this.request.text.body = "Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo previo permitido para cancelar ha sido superado.";
    //   }
    // }else {
    //   this.request.text.body = "Gracias por su respuesta, su reserva sera gestionada a la brevedad y pronto sera contactado."; 
    // }

    // try {
    //   let response = await firstValueFrom(this.httpService.post(this.baseUrl, this.request));
    //   console.log("Response de whatapp API ", response.data);
    // } catch (error) {
    //     throw new BadRequestException();
    // }
    

    return data;
  }
  
  async create(createProductDto: CreateChatDto) {
    
    try {

      const product = this.chatRepository.create(createProductDto);
      await this.chatRepository.save( product );

      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createWebhook(createProductDto: CreateChatDto) {
    
    try {
      
      let product = await this.chatRepository.findOneBy({ watsapp_id: createProductDto.watsapp_id });
      console.log("Se encontro una coincidencia: ", product)
      if ( !product ) {
        product = this.chatRepository.create(createProductDto);
        await this.chatRepository.save( product );
  
        return product;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async findLengthMessages() {
    const messagesLength = await this.chatRepository.count();
    return await messagesLength;
  }


  async findAll( paginationDto: PaginationDto ) {

    const { limit , offset } = paginationDto;

    const messages = await this.chatRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })

     return messages.map ( chatMessges => ({
      ...chatMessges,
    }) )
  }

  // enviarNotificacion(): Observable<any> {
  //   return this.httpService.get('https://api-nest-ws.herokuapp.com/api/chat').pipe(
  //     map(resp => resp.data)).subscribe(data => {
  //       console.log(data);
  //     });
  // }


  async findOne( term: string ) {

    let product: Chat;

    if ( isUUID(term) ) {
      product = await this.chatRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.chatRepository.createQueryBuilder(); 
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }


    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async update( id: string, updateProductDto: UpdateChatDto ) {

    const product = await this.chatRepository.preload({
      id: id,
      ...updateProductDto
    });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    try {
      await this.chatRepository.save( product );
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.chatRepository.remove( product );
    
  }


  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
