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
import { response } from 'express';




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
        "body": "Response Default"
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
      console.log('⋙💾💾✅✅⋙ Datos del negocio guardados ⋙⋙ ',apiWs);
      return {apiWs};
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }


  // ############# Guardado de los datos en la tabla de las Error Response#############
  // ############################### Edgardo Lugo #####################################

  async CreateRegisterLogFail(createLogFaileDto:CreateLogFailDto){
    try {
      console.log('⋙💾✅💾⋙ Ingresa a guardar error ⋘💾✅💾⋘');
      const logFail = this.logFailRepository.create(createLogFaileDto);
      logFail.create_data = Date.now().toString();
      await this.logFailRepository.save(logFail);
      // console.log('Datos del error guardados');
      // return true;
    } catch (error) {
      console.log("⋙💾❌💾⋙ Hubo un error al guardar el error en la base de datos ⋘💾❌💾⋘")
      this.handleDBExceptions(error)
      // return false;
    }
  }

  //###################################################################################

  async sendMessage(request: WhatsappCloudApiRequest): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(this.httpService.post(this.baseUrl, request));
    console.log("📩📩📩 Objeto enviado a Facebook 📩 ⋙ ", request);
    console.log("📩📩📩 Objeto recibido como respuesta 📩 ⋘ ", data);
    return data;
  }

  async updateReservation(token: string, phone_number: string, text_message:string, timestamp_message: string, watsapp_id: string): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    console.log("🔄🔄🔄🔄🔄🔄 Update Reservation 🔄🔄🔄🔄🔄🔄 ⋙ ⋘");
    console.log("⏩⏩ token recibido: ", token);
    console.log("⏩⏩ phone_number recibido: ", phone_number);
    console.log("⏩⏩ timestamp_message recibido: ", timestamp_message);

    

    this.request.to = phone_number;
    let body = {
      date: dayjs().format("YYYY-MM-DD HH:mm")
    }
    console.log("⏩⏩ body: ", body);
    let data; 
    const urlAPIplanner = `${this.urlPlanner}${token}`;
    console.log("⏩⏩ urlAPIplanner: ", urlAPIplanner);
     try {
      this.httpService.put(`${this.urlPlanner}${token}`, body).subscribe(data =>{

        console.log("✅✅✅✅✅✅ Respuesta exitosa de planner ✅✅✅✅✅✅");

        // console.log("⏩⏩⏩⏩⏩⏩⏩⏩ Cuerpo de la respuesta: ", data.data);

        let retMessage = data.data.retMessage;
        let retCode = data.data.retCode;
        let retObject = data.data.retObject;
        console.log("⏩⏩ Status: ", data.status);
        console.log("⏩⏩ StatusText: ", data.statusText);
        console.log("⏩⏩ retMessage: ", retMessage);
        console.log("⏩⏩ retCode: ", retCode);
        console.log("⏩⏩ retObject: ", retObject);
        console.log("⏩⏩ timestamp_message: ", timestamp_message);

        this.request.text.body = "Gracias por su respuesta, a la brevedad pronto sera contactado.";

        if ((data.statusText === "OK") && (retMessage === "1")){
          this.request.text.body = "Su reserva ha sido confirmada con éxito. Gracias por su respuesta.";
          console.log("👍👍👍👍 Respuesta de planner OK: Accept => ",token);

        }

        if ((data.statusText === "OK") && (retMessage === "3")) {
          this.request.text.body = "Su reserva ha sido cancelada con éxito. Gracias por su respuesta.";
          console.log("👍👍👍👍 Respuesta de planner OK: Cancel => ",token);
        }

        if ((data.statusText === "Bad Request") && (retMessage === "9")) {  
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + retObject.time + ' horas antes.';
          this.request.text.body = 'Su solicitud no ha sido procesada. El tiempo para cancelar ha pasado.';
          console.log("⭕⭕⭕⭕ Respuesta de planner Bad Request: Cancel => ",token);
        }

        if ((data.statusText === "Bad Request") && (retMessage === "1")) {  
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + retObject.time + ' horas antes.';
          this.request.text.body = 'Lo sentimos pero ya no puede procesar la reserva.';
          console.log("⭕⭕⭕⭕ Respuesta de planner Bad Request: Cancel => ",token);
        }
        
        this.httpService.post(this.baseUrl, this.request).subscribe(res => {
          console.log("✅✅ Respuesta exitosa del whatsapp", res.statusText); 
        },
        (error) => {
          console.log("🚫🚫 Ocurrio un error al enviar el mensaje por whatsapp ", error);
        }); 
      },
      (error) => {

        console.log("❌❌❌❌❌❌ Error de solicitud ❌❌❌❌❌❌ ");

        let errorResponse = error.response;

        // console.log('⏩⏩⏩⏩⏩⏩⏩⏩ Cuerpo de la respuesta de error: ', errorResponse)

        console.log("⏩⏩ Status: ", errorResponse.status.toString());
        console.log("⏩⏩ Data: ", JSON.stringify(errorResponse.data));
        console.log("⏩⏩ Status Text: ",errorResponse.statusText);
        console.log("⏩⏩ ConfigMethod: ",errorResponse.config.method);
        console.log("⏩⏩ ConfigURL: ",errorResponse.config.url);
        console.log("⏩⏩ ConfigData: (body date) ", JSON.stringify(errorResponse.config.data));
        console.log("⏩⏩ Texto recibido: ", text_message);
        console.log("⏩⏩ Token recibido: ", token);
        // console.log("⏩⏩ URL API Planner: ", urlAPIplanner);
        console.log("⏩⏩ Body enviado", JSON.stringify(body));
        console.log("⏩⏩ Timestamp del mensaje: ",timestamp_message);
        console.log("⏩⏩ Id Message WhatsApp: ", watsapp_id);

        this.request.text.body = "Ocurrio un inconveniente al procesar su solicitud. Disculpe las molestias, estamos trabajando para solventarlo. ";


        // console.log("ocurrio un error en la respuesta de planner y no se cancelo", JSON.stringify(errorResponse));

        // Si el token no existe en planner, error en escribir el token
        if ((errorResponse.status === 401) && (errorResponse.statusText === "Unauthorized")){
          console.log("👎👎👎👎 Error de solicitud: Unauthorized => ",token);
          this.request.text.body = "Su solicitud no puede ser procesada. Por usar un token invalido. ";
        }

        // Si el token no es válido en planner 
        if ((errorResponse.status === 401) && (errorResponse.statusText === "Not Acceptable")){
          console.log("👎👎👎👎 Error de solicitud! Not Acceptable: Token => ", token);
          this.request.text.body = "Su solicitud no ha sido procesada. Su reserva ya ha pasado.";
        }

        // Si el token no es válido en planner, el token no ya no se puede usar
        if ((errorResponse.statusText === "Not Found") && (errorResponse.status === 404)){
          console.log("👎👎👎👎 Error de solicitud! Not Found Token => ", token);
          this.request.text.body = "Lo sentimos esta accion ya no valida."
        }
        
        // Si el token es válido en planner, pero ya no se puede cancelar la reverva
        if ((errorResponse.status === 400) && (errorResponse.data.retMessage === "9")) { // errorResponse.statusText === "Bad Request" && 
          console.log("👎👎👎👎 Respuesta de planner Status 400: Cancel => ",token);
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + errorResponse.data.retObject.time + ' horas antes.';
          this.request.text.body = 'Su solicitud no ha sido procesada. El tiempo para cancelar ha pasado.';
        }
        
        // Si el tiempo para cancelar ha pasado 
        if ((errorResponse.status === 406) && (errorResponse.statusText === "Not Acceptable") && (errorResponse.data.retCode === "1")){
          console.log("👎👎👎👎 Error de solicitud! Not Acceptable: Token => ", token);
          this.request.text.body = "Su solicitud no ha sido procesada. El tiempo para cancelar ha pasado.";
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + JSON.stringify(errorResponse.data.retObject.time) + ' horas antes.';
        }
        
        // Si el status es 400 con Bad Request y retMessage es 1 
        if ((errorResponse.status === 400) && (errorResponse.statusText === "Bad Request") && (errorResponse.data.retMessage === "1")){
          console.log("👎👎👎👎 Error de solicitud! Bad Request: Token => ", token);
          this.request.text.body = "Su solicitud no ha sido procesada. El tiempo para confirmar ha pasado.";
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + JSON.stringify(errorResponse.data.retObject.time) + ' horas antes.';
        }

        // Si el status es 409 con Conflit y retCode es 1
        if ((errorResponse.status === 409) && (errorResponse.statusText === "Conflit") && (errorResponse.data.retCode === "1")){
          console.log("👎👎👎👎 Error de solicitud! Bad Request: Token => ", token);
          this.request.text.body = "Su solicitud no ha sido procesada. Verifique la fecha de su sistema";
        }


        // **************************************************************************************************

        const logFail = {
          "status_code": errorResponse.status.toString(),
          "status_text": errorResponse.statusText,
          "response": JSON.stringify(errorResponse.data),
          "token": token,
          "text_message": text_message,
          "phone_number": phone_number.toString(),
          "config_method": errorResponse.config.method,
          "config_data": errorResponse.config.data,
          "urlplanner": urlAPIplanner,
          "body_send":JSON.stringify(body),
          "respuesta":  this.request.text.body,
          "timestamp_message": timestamp_message,
          "watsapp_id": watsapp_id
        }
        // console.log('Datos a guardar en la tabla: ', logFail);
        // ############# Guardado de los datos en la tabla para Error Response#############
        this.CreateRegisterLogFail(logFail);

        // ########## enviar email de error ##########

        this.sendEmailError(logFail);

        // **************************************************************************************************

        // this.request.text.body = "Gracias por su respuesta, a la brevedad pronto sera contactado."
        this.httpService.post(this.baseUrl, this.request).subscribe(res => {
          console.log("✅✅✅ Respuesta exitosa de la API whatsApp de Facebook ✅✅✅", res.statusText); 
        },
        (error) => {
          console.log("🚫🚫🚫 Ocurrio un error al enviar el mensaje por whatsapp 🚫🚫🚫", error);
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

/* ############################################################################################################

if (error.status === 400) {
  if (error.error.message === 1) {
    this.message = "La reservacion ya se encuentra aprobada previamente.";
  }else if (error.retMessague === 3) { 
    this.message = "La reservacion ya ha sido cancelada previamente.";
  }else if (error.retMessague === 9) {
    this.message = "Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo previo permitido para cancelar ha sido superado.";
  }

  this.isConfirm = true;
  this.loading = false;
} else { if (error.status === 409) {
  this.message = "El reloj esta atrasado, por favor sincronice su reloj con el servidor.";
  this.commit = "No se puede establecer una conexion porque la fecha y la hora del equipo no son correctas.";
  this.isConfirm = true;
  this.loading = false;
} else {
  this.router.navigate(['/error']);
}


############################################################################################################### */


  // ###################################### Envio de email de error ###########################################
  async sendEmailError(data: any) {

    const ret=  (JSON.parse(data.response))? JSON.parse(data.response) : data.response;
    const notFounf = "Dato no recibido";
    const anho = new Date().getFullYear();
    const emailMessage = `
      <div style="margin: 0 0 7px border-radius: 15px 50px 30px border: 1px solid transparent; ">
        <table style="max-width: 800px; padding: 10px; margin:0 auto; border-collapse: collapse; border-radius: 8px;">
    
          <tr>
            <td style="padding: 0">
              <img style="padding: 0; display: block; object-fit:cover; object-position: 50% 50%" src="https://ithemes.com/wp-content/uploads/2022/08/There-Has-Been-a-Critical-Error-on-Your-Website-1024x537.png" width="100%">
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f3f3f3">
              <div style="color: #1a1a1a; margin: 4% 10% 2%; font-family: sans-serif">
                <h2 style="color: #e67e22; margin: 0 0 7px">¡Datos del error!</h2>
                <p style="margin: 2px; font-size: 15px">Ha ocurrido un error al enviar el token a la API de planner.</p><br>

                <p style="margin: 2px; font-size: 15px"><h3>Los siguientes datos han sido guardados en la bade de datos:</h3></p>
                <p style="margin: 2px; font-size: 15px"><strong>Status: </strong> ${data.status_code} </p>
                <p style="margin: 2px; font-size: 15px"><strong>Status Message: </strong> ${data.status_text} </p>

                
                <p style="margin: 2px; font-size: 15px"> <h3 style="color: #e67e22; margin: 0 0 7px"><strong>Mensaje enviado por el usuario.</strong></h3> </p>
                
                <ul style="font-size: 15px;  margin: 10px 0">
                <li><strong> Texto recibido: </strong> ${data.text_message || notFounf } </li>
                <li><strong> Token recibido: </strong> ${data.token || notFounf } </li>
                <li><strong>Timestamp del mensaje: </strong> ${data.timestamp_message || notFounf } </li>
                <li><strong>Id del mensaje de WhatsApp: </strong> ${data.watsapp_id || notFounf } </li>
                </ul>

                <p style="margin: 2px; font-size: 15px"> <h3 style="color: #e67e22; margin: 0 0 7px"><strong>Repuesta enviada al usuario.</strong></h3> </p>
                
                <ul style="font-size: 15px;  margin: 10px 0">
                <li><strong> Texto enviado: </strong> ${data.respuesta || notFounf } </li>
                </ul>

                <p style="margin: 2px; font-size: 15px"> <h3 style="color: #e67e22; margin: 0 0 7px"><strong>Datos enviados a la API de Planner.</strong></h3> </p>

                <ul style="font-size: 15px;  margin: 10px 0">
                  <li><strong> Body enviado: </strong> ${data.body_send || notFounf } </li>
                  <li><strong> URL API Planner: </strong> ${data.urlplanner || notFounf } </li>
                </ul>

                <p style="margin: 2px; font-size: 15px"> <h3 style="color: #e67e22; margin: 0 0 7px"><strong>Respuesta de petición a Planner.</strong></h3> </p>
                
                <ul style="font-size: 15px;  margin: 10px 0">

                  <li><strong> retCode: </strong> ${ret.retCode || notFounf } </li>
                  <li><strong> retMessage: </strong> ${ret.retMessage || notFounf } </li>
                  <li><strong> retObject: </strong> ${JSON.stringify(ret.retObject) || notFounf } </li>
                </ul>

                <p style="margin: 2px; font-size: 15px"><strong>Token: </strong> ${data.token} </p>
                <p style="margin: 2px; font-size: 15px"><strong>Phone Number: </strong> +${data.phone_number} </p>
                <p style="margin: 2px; font-size: 15px"><strong>Method: </strong> ${data.config_method} </p>
                <p style="margin: 2px; font-size: 15px"><strong>Date (UTC+0): </strong> ${JSON.parse(data.config_data).date} </p>
                <p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">API-Email & API-Ws &copy; ${anho}</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;

    const emailRemitente={
          "to":process.env.EMAIL_TO,
          "subject":"Error de solicitud token: " + data.token,
          "html":emailMessage
        }
    
    try {
      await this.httpService.post(process.env.EMAIL_URL, emailRemitente).subscribe(res => {
          // console.log(" 📧📧 Se envio el correo de error: ", emailRemitente);
          console.log(" 📧📧 Response of Api email: ", res.data); 
        },
        (error) => {
          console.log(" ⛔⛔ Ocurrio un error con la peticion a la Api email: ", error);
        });
    } catch (error) {
        console.log(" ⛔⛔ Ocurrio un error con la peticion a la Api email: ", error);
        throw new BadRequestException();
    }
    
  }
  // ##################################################################################################################

  async create(createProductDto: CreateChatDto) {
    
    try {

      const product = this.chatRepository.create(createProductDto);
      await this.chatRepository.save( product );

      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /* #####################################################################################################################
  ######################### Se verifica si el id del mensaje ya existe en la base de datos. ##############################
  ##################################################################################################################### */
  async validateIDwatsappMessage( watsapp_id: string ) {
    console.info("⏩⏩ Se verifica si el '", watsapp_id, "' ya existe en la base de datos.")
    try {
      let idMessage = await this.chatRepository.findOneBy({ watsapp_id: watsapp_id });
      console.log("⏩⏩ Coincidencia: ", idMessage)

      if ( idMessage ){
        console.log("⏩⏩ El id del mensaje ya existe en la base de datos.")
        return true;
      }else{
        console.log("⏩⏩ El id del mensaje no existe en la base de datos.")
        return false;
      }
    
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  // ############### Fin de la función de validar si el id del mensaje esta en la base de datos ##########################


  async createWebhook(createProductDto: CreateChatDto) {
    
    try {
      
      let product = await this.chatRepository.findOneBy({ watsapp_id: createProductDto.watsapp_id });
      console.log("⏩⏩ Se encontro una coincidencia: ", product)
      if ( !product ) {
        product = this.chatRepository.create(createProductDto);
        await this.chatRepository.save( product );

        console.log("⏩⏩ Se guardo el mensaje: ", product)
  
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
