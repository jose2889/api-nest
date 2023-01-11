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
import { WhatsappCloudAPIResponse, responseWhatsappTemplate } from 'src/common/whatsapp-cloud-api-response.dto';
import { AxiosResponse } from 'axios'
import { ApiWs } from './entities/api_ws.entity';
import { LogFail } from './entities/log-fail.entity';
import { UpdateApiWsDto } from './dto/update-api-ws.dto';

// ############### Importaciones para el manejo de fechas ###############
import * as dayjs from 'dayjs';
import * as utcdayjs from 'dayjs/plugin/utc';
import * as timezonedayjs from 'dayjs/plugin/timezone';
dayjs.extend(utcdayjs);
dayjs.extend(timezonedayjs);

// ############### Importaciones para el manejo mail ###############
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { countrytimezone } from './data/country-timezone';
import { CreateSendTemplateDto } from './dto/create-send-template.dto';
import { SendTemplate } from './entities/send-template.entity';




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

    private readonly httpService:HttpService,

    private readonly mailerService: MailerService,

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(ApiWs)
    private readonly apiWsRepository: Repository<ApiWs>, //variable para regsitar API Ws

    @InjectRepository(LogFail)
    private readonly logFailRepository: Repository<LogFail>, //variable para regsitar Log Fail

    @InjectRepository(SendTemplate)
    private readonly sendTemplateRepository:Repository<SendTemplate>// varaible paa registrar Send Template

  ) {}


  async sendMessage(request: WhatsappCloudApiRequest, template?:string, request_planner?:any): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    
    console.log("📩📩📩 Se envio la plantilla de ",template," de reserva");

    const {data} = await firstValueFrom(this.httpService.post(this.baseUrl, request));
    // console.log("📩📩📩 Objeto enviado a Facebook 📩 ⋙ ", request);
    // console.log("📩📩📩 Objeto recibido como respuesta 📩 ⋘ ", data);

    let dataRes = {
      watsapp_id: data.contacts[0].wa_id,
      to_phone: data.messages[0].id,
      customer_name: "",
      name_business: "",
      type: template,
      template: request.template.name,
      date: "",
      timestamp: Date.now(),
      slug: "",
      token_confirm: "",
      token_cancel: ""
    }

    if (template === "notificacion"){
      const { phoneNumber, slug, date, businessName} = request_planner;
      dataRes.name_business = businessName;
      dataRes.slug = slug;
      dataRes.to_phone = phoneNumber;
      dataRes.date = date;
    }

    if (template === "confirmacion"){
      const { phoneNumber, customerName, date, businessName, confirmToken, cancelToken, slug} = request_planner; 
      dataRes.name_business = businessName;
      dataRes.customer_name = customerName;
      dataRes.slug = slug;
      dataRes.to_phone = phoneNumber;
      dataRes.date = date;
      dataRes.token_confirm = confirmToken;
      dataRes.token_cancel = cancelToken;
    }

    this.createSendTemplate(dataRes);    
     
    return data;
  }

  changTimezone(timezone: string, date: string): string {
    return dayjs(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  }  

  async updateReservation(token: string, phone_number: string, text_message:string, timestamp_message: string, watsapp_id: string, acount_business): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    console.log("🔄🔄🔄🔄🔄🔄 ⋙ ⚜ ⋙ Update Reservation ⋘ ⚜ ⋘ 🔄🔄🔄🔄🔄🔄");
    console.log("⏩⏩ phone_number recibido: ", phone_number ," ⏩🔄⏩ token recibido: ", token);
    // console.log("⏩⏩ timestamp_message recibido: ", timestamp_message);
    // console.log("⏩⏩ Datos del negocio recibido: ", acount_business);
    
    // let TimeZoneBusiness = this.BusinessService.determineTimeZone(phone_number, acount_business.id_ws_acount); // determino la zona horaria del negocio
    // console.log("⏩⏩ TimeZoneBusiness: ", TimeZoneBusiness);
  

    this.request.to = phone_number; // numero de telefono del cliente que envia el mensaje
    let timezone = 'UTC'; // zona horaria por defecto
    let codePhoneContry = 0; // codigo de pais por defecto
  
         // A partir de aqui determino el pais del cliente a partir del numero de telefono del cliente que envia el mensaje
      if (phone_number.startsWith("1809") || phone_number.startsWith("1829") || phone_number.startsWith("1849")) {
        timezone = "America/Santo_Domingo";
        codePhoneContry = parseInt(phone_number.slice(0,4));
      }else if (phone_number.startsWith("598")){
        timezone = "America/Montevideo";
        codePhoneContry = 598;
      }else if (phone_number.startsWith("593")) {
        timezone = "America/Guayaquil";
        codePhoneContry = 593;
      }else if (phone_number.startsWith("591")) {
        timezone = "America/La_Paz";
        codePhoneContry = 591;
      }else if (phone_number.startsWith("56")) {
        timezone = "America/Santiago";
        codePhoneContry = 56;
      }
      else if (phone_number.startsWith("57")) { 
        timezone = "America/Bogota";
        codePhoneContry = 57;
      }
      else if (phone_number.startsWith("52")) {
        timezone = "America/Mexico_City";
        codePhoneContry = 52;
      }
      else if (phone_number.startsWith("51")) {
        timezone = "America/Lima";
        codePhoneContry = 51;
      }
      else if (phone_number.startsWith("54")) {
        timezone = "America/Argentina/Buenos_Aires";
        codePhoneContry = 54;
      }
      else if (phone_number.startsWith("55")) {
        timezone = "America/Sao_Paulo";
        codePhoneContry = 55;
      }
      else if (phone_number.startsWith("58")) {
        timezone = "America/Caracas";
        codePhoneContry = 58;
      }
      else if (phone_number.startsWith("34")) {
        timezone = "Europe/Madrid";
        codePhoneContry = 34;
      }

    let bodyChangeTimezone = {
      // date: dayjs().format("YYYY-MM-DD HH:mm"),
      date: this.changTimezone(timezone, dayjs(parseInt(timestamp_message)*1000).format("YYYY-MM-DD HH:mm")),
    }

    let body = bodyChangeTimezone;

    console.log("⏩⏩⏩ TimeZome: ", timezone);
    // console.log("⏩⏩⏩ Country: ", country);
    console.log("⏩⏩⏩ body: ", body);
    // console.log("⏩⏩⏩ code phone: ", codePhoneContry);

    // let data; 


    const urlAPIplanner = `${this.urlPlanner}${token}`;
    // console.log("⏩⏩ urlAPIplanner: ", urlAPIplanner);
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
        // console.log("⏩⏩ ConfigMethod: ",errorResponse.config.method);
        // console.log("⏩⏩ ConfigURL: ",errorResponse.config.url);
        // console.log("⏩⏩ ConfigData: (body date) ", JSON.stringify(errorResponse.config.data));
        // console.log("⏩⏩ Texto recibido: ", text_message);
        // console.log("⏩⏩ Token recibido: ", token);
        // console.log("⏩⏩ URL API Planner: ", urlAPIplanner);
        // console.log("⏩⏩ Body enviado", JSON.stringify(body));
        // console.log("⏩⏩ Timestamp del mensaje: ",timestamp_message);
        // console.log("⏩⏩ Id Message WhatsApp: ", watsapp_id);

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
          this.request.text.body = "Su solicitud no ha sido procesada. El tiempo para confirmar ha pasado o la reservación ya ha pasado";
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + JSON.stringify(errorResponse.data.retObject.time) + ' horas antes.';
        }

        // Si el status es Bad Request y retCode es 1 
        if ((errorResponse.statusText === "Bad Request") && (errorResponse.data.retCode === "1")){
          console.log("👎👎👎👎 Error de solicitud! Bad Request: Token => ", token);
          this.request.text.body = "Su solicitud no ha sido procesada. El tiempo para cancelar ha pasado o la reservación ya ha pasado";
          // this.request.text.body = 'Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo de cancelación es de ' + JSON.stringify(errorResponse.data.retObject.time) + ' horas antes.';
        }

        // Si el status es 409 con Conflit y retCode es 1
        if ((errorResponse.status === 409) && (errorResponse.statusText === "Conflict")){ // && (errorResponse.data.retCode === "1")
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
          "watsapp_id": watsapp_id,
          "timezone": timezone,
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

    return;
  }

    /* ##################################################################################################################################

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


    ##################################################################################################################################### */


  // ############################################################ Envio de email de error ###########################################
  async sendEmailError(data: any): Promise<void> {

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
                <p style="margin: 2px; font-size: 15px"><strong>Date (${data.timezone}): </strong> ${JSON.parse(data.config_data).date} </p>
                <p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">API-Email & API-Ws &copy; ${anho}</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;

    const emailRemitente={
          "from":process.env.EMAIL_USEREMAIL,
          "to":process.env.EMAIL_TO,
          "subject":"Error de solicitud token: " + data.token,
          "html":emailMessage
        }
  
    // ################## Sending Email #####################
    this.sendMailPlanner(emailRemitente);
    // ######################################################

    // try {
    //   await this.httpService.post(process.env.EMAIL_URL, emailRemitente).subscribe(res => {
    //       // console.log(" 📧📧 Se envio el correo de error: ", emailRemitente);
    //       console.log(" 📧📧 Response of Api email: ", res.data); 
    //     },
    //     (error) => {
    //       console.log(" ⛔⛔ Ocurrio un error con la peticion a la Api email: ", error);
    //     });
    // } catch (error) {
    //     console.log(" ⛔⛔ Ocurrio un error con la peticion a la Api email: ", error);
    //     throw new BadRequestException();
    // }
    
  }

  sendMailPlanner(emailRemitente): void {
    this.mailerService
      .sendMail({
        ...emailRemitente
      })
      .then(() => {
        console.log(" 📧📧 Se envio el correo de error: ", emailRemitente.to);
      })
      .catch (error => {
        console.log(" ⛔⛔ Ocurrio un error con la peticion a la Api email: ", emailRemitente.to);
        console.log(" ⛔⛔ Mesaje de error: ",error.message);
      });    
  }

  // ########################################################################################################################################

  async create(createProductDto: CreateChatDto) {
    
    try {

      const product = this.chatRepository.create(createProductDto);
      await this.chatRepository.save( product );

      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createSendTemplate(createSendTemplateDto: CreateSendTemplateDto) {
    
    try {

      const sendTemaplate = this.sendTemplateRepository.create(createSendTemplateDto);
      await this.sendTemplateRepository.save( sendTemaplate );
      console.log('🌌🌌🌌Se registro el envio de mensjae de plantilla de ',createSendTemplateDto.type);
      return sendTemaplate;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /* ###########################################################################################################################################
  ############################################### Se verifica si el id del mensaje ya existe en la base de datos. ##############################
  ########################################################################################################################################### */
  async validateIDwatsappMessage( watsapp_id: string ) {
    console.info("⏩⏩ Se verifica si el '", watsapp_id, "' ya existe en la base de datos.")
    try {
      let idMessage = await this.chatRepository.findOneBy({ watsapp_id: watsapp_id });
      // console.log("⏩⏩ Coincidencia: ", idMessage)

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

  // ##################################### Fin de la función de validar si el id del mensaje esta en la base de datos ##########################


  async createWebhook(createProductDto: CreateChatDto) {
    
    try {
      
      let product = await this.chatRepository.findOneBy({ watsapp_id: createProductDto.watsapp_id });
      // console.log("⏩⏩ Se encontro una coincidencia: ", product)
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


  // ################################### Gestión de los datos en la tabla de las ApiWs para negocios ###################################

  async CreateRegisterApiWs(createApiWsDot:CreateApiWSDto){
    try {
      const apiWs = this.apiWsRepository.create(createApiWsDot);
      apiWs.create_data = Date.now(); //.toString();
      await this.apiWsRepository.save(apiWs);
      console.log('📁📁💼💼 Se registro el negocio con los siguientes datos: 📁📁 ',apiWs);
      return apiWs;
    } catch (error) {
      console.log('💩💩 Ocurrio un error al registrar el negocio: 💩💩 ',error);
      this.handleDBExceptions(error)
    }
  }

  async findAllbusiness( paginationDto: PaginationDto ) {

    const { limit , offset } = paginationDto;

    const business = await this.apiWsRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })

    console.log('🔎🔎🔎 Se mostro listado de negocios');
    return business.map ( itemsbusiness => ({
      ...itemsbusiness,
    }) )
  }


  async findOnebusiness( term: string ) {

    let business: ApiWs;

    if ( isUUID(term) ) {
      business = await this.apiWsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.apiWsRepository.createQueryBuilder(); 
      business = await queryBuilder
        .where('UPPER(phone_api) =:phone_api or slug_business =:slug_business or id_cuenta_business=:id_cuenta_business or country_business=:country_business', {
          phone_api: term,
          slug_business: term.toLowerCase(),
          id_cuenta_business: term,
          country_business: term
        }).getOne();
    }


    if ( !business ) {
      console.log('Detalles de la busqueda de negocio con el termino: ', term);
      throw new NotFoundException(`business with ${ term } not found`);
    }

    return business;
  }

  async updatebusiness( id: string, updateApiWsDto: UpdateApiWsDto ) {

    const business = await this.apiWsRepository.preload({
      id: id,
      ...updateApiWsDto
    });

    if ( !business ) throw new NotFoundException(`business with id: ${ id } not found`);

    try {
      await this.apiWsRepository.save( business );
      console.log('♻︎♻︎💼💼 Se actulizaron los datos del negocio con el id: ', id, ' con los datos: ', updateApiWsDto);

      return business;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async removebusiness(id: string) {
    const business: ApiWs = await this.findOnebusiness( id );
    // try {
      await this.apiWsRepository.remove( business );
      console.log('Se elimino el negocio con el id: ', id);
      return business;
    // } catch (error) {
    //   this.handleDBExceptions(error);
    // }
  }

  // ################################################################################################

  // ############################ Gestión de los datos en la tabla de las Error Response#############

  async CreateRegisterLogFail(createLogFaileDto:CreateLogFailDto){
    try {
      console.log('⋙💾✅💾⋙ Ingresa a guardar error ⋘💾✅💾⋘');
      const logFail = this.logFailRepository.create(createLogFaileDto);
      logFail.create_data = Date.now(); //.toString();
      await this.logFailRepository.save(logFail);
      // console.log('Datos del error guardados');
      // return true;
    } catch (error) {
      console.log("⋙💾❌💾⋙ Hubo un error al guardar el error en la base de datos ⋘💾❌💾⋘")
      this.handleDBExceptions(error)
      // return false;
    }
  }

   async findAllError( paginationDto: PaginationDto ) {

    const { limit , offset } = paginationDto;

    const errorList = await this.logFailRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })

     return errorList.map ( errorMessges => ({
      ...errorMessges,
    }) )
  }
  
  async findLengthError() {
    const errorLength = await this.logFailRepository.count();
    return await errorLength;
  }

  // ### Regitros de la tabla de los errores en menos de 24 horas
  async findError24(tiempo: number) {
    // console.log('⌚⌚⌚ ',Date.now(), ' ⌚⌚⌚');
    // console.log('⌚⌚⌚ ',Date.now() - (60000 * tiempo), ' ⌚⌚⌚');
    const queryBuilder = this.logFailRepository.createQueryBuilder();
    const errorLength = await queryBuilder
      .where('create_data >=:create_data', {
        create_data: (Date.now() - (3600000 * tiempo)),
      }).getMany(); //.getCount();
    console.log('⌚⌚⌚ Lista de errores en un tiempo determinado (',tiempo,'): ',errorLength, ' ⌚ ',Date.now(),' ⌚ ',Date.now() - (60000 * tiempo),' ⌚');

    return errorLength;
  }
  

  //######################################################################################################################################


  // ############################ Gestión de los datos en la tabla de los envios de plantillas #############

 
   async findAllTemplate( paginationDto: PaginationDto ) {

    const { limit , offset } = paginationDto;

    const templateList = await this.sendTemplateRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })

     return templateList.map ( errorMessges => ({
      ...errorMessges,
    }) )
  }
  
  async findLengthTemplate() {
    const templateLength = await this.sendTemplateRepository.count();
    return await templateLength;
  }

  // ### Regitros de la tabla de los template en un tiempo determinado en horas
  async findTemplate24(tiempo: number) {
    // console.log('⌚⌚⌚ ',Date.now(), ' ⌚⌚⌚');
    // console.log('⌚⌚⌚ ',Date.now() - (60000 * tiempo), ' ⌚⌚⌚');
    const queryBuilder = this.sendTemplateRepository.createQueryBuilder();
    const templateLength = await queryBuilder
      .where('timestamp >=:timestamp', {
        timestamp: (Date.now() - (3600000 * tiempo)),
      }).getMany(); //.getCount();
    console.log('⌚⌚⌚ Lista de errores en un tiempo determinado (',tiempo,'): ',templateLength, ' ⌚ ',Date.now(),' ⌚ ',Date.now() - (60000 * tiempo),' ⌚');

    return templateLength;
  }
  

  //######################################################################################################################################


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
