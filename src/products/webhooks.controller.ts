import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ForbiddenException, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiTags } from '@nestjs/swagger';
import { json } from 'stream/consumers';

@ApiTags('Webhooks')
@Controller('webhook')
export class Webhookontroller {
  constructor(private readonly chatService: WhatsappService) {}

  @Post()
  @HttpCode(HttpStatus.OK)  // PAra que si se recibe la petición de Facebook devuelva un status OK
  async createWebhook(@Body() data:any) {

    console.log("📜📜📜📜📜 Objeto recibido de Facebook de la API de WhatsApp 📜📜📜 ",JSON.stringify(data));
    
    let createProductDto = new CreateChatDto();
    if (data.object) {
      if (
        data.entry &&
        data.entry[0].changes &&
        data.entry[0].changes[0] &&
        data.entry[0].changes[0].value.messages &&
        data.entry[0].changes[0].value.messages[0]
      ) {

        console.log("📜📜📜 La petición POST de Facebook es de tipo message");
        let phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id;
        let from = data.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload

        let type = data.entry[0].changes[0].value.messages[0].type;
        let name = data.entry[0].changes[0].value.contacts[0].profile.name;
        let timestamp = data.entry[0].changes[0].value.messages[0].timestamp;
        let watsapp_id = data.entry[0].changes[0].value.messages[0].id;
        let acount_businnes = {
          'id_ws_acount' : data.entry[0].id,
          'display_phone_number' : data.entry[0].changes[0].value.metadata.display_phone_number,
          'id_phone_number' : data.entry[0].changes[0].value.metadata.phone_number_id,
        }

        let coincidencia = await this.chatService.validateIDwatsappMessage(watsapp_id);
        // console.log("⏩⏩⏩⏩⏩⏩⏩⏩⏩⏩ Horita: ", Date.now());
        console.log("⏩⏩⏩⏩⏩⏩⏩⏩⏩⏩ Coincidencia: ", coincidencia);
        let tiempoRetraso = Date.now() - timestamp*1000;
        if (!coincidencia && tiempoRetraso < 600000) {
          console.log(coincidencia)
          if (type == "text") createProductDto.text = data.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
          if (type == "button") {

            console.log("📜📜📜 Objeto de la petición de tipo button recibida: ", JSON.stringify(data));

            createProductDto.text = data.entry[0].changes[0].value.messages[0].button.text;
            createProductDto.payload = data.entry[0].changes[0].value.messages[0].button.payload;
            this.chatService.updateReservation(createProductDto.payload, from, createProductDto.text, timestamp, watsapp_id, acount_businnes); 
          } 
        }
        createProductDto.from = from; 
        createProductDto.phone_number_id = phone_number_id; 
        createProductDto.name = name;
        createProductDto.type = type;
        createProductDto.timestamp = timestamp; 
        createProductDto.watsapp_id = watsapp_id;
        createProductDto.answered_message = true;

        // console.log(" ⏩⏩⏩⏩⏩ Se guarada el objeto ", JSON.stringify(createProductDto));
        this.chatService.createWebhook(createProductDto);

        return;
      }
      
    } 

     return; 
  }

  @Get()
  authWebhook(@Res() res, @Query( 'hub.mode' ) mode: string, @Query( 'hub.verify_token' ) token: string, @Query( 'hub.challenge' ) challenge: string) {
     console.log("⏩⏩⏩⏩ Datos por parametro ", mode, token, challenge)
     /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
   const verify_token = process.env.VERIFY_TOKEN;

  //  let mode = req.query["hub.mode"];
  //  let token = req.query["hub.verify_token"];
  //  let challenge = req.query["hub.challenge"];
 
   // Check if a token and mode were sent
   if (mode && token) {
     // Check the mode and token sent are correct
     if (mode === "subscribe" && token === verify_token) {
       // Respond with 200 OK and challenge token from the request
       console.log("✅✅✅ WEBHOOK_VERIFIED ✅✅✅");
       res.status(200).send(challenge);
     } else {
       // Responds with '403 Forbidden' if verify tokens do not match
       throw new ForbiddenException();
     }
   }
   res.status(400).send("Los datos no son validos");
  }

  @Post('test')
  testUpdate(@Res() res, @Query( 'token' ) token: string, @Body() body: any) {
    console.log("⏩⏩⏩ Datos por parametro: ", token)
    console.log("⏩⏩⏩ Datos por body: ", body)
    
    let response = this.chatService.updateReservation(token, body.phone_number, body.text, 'tiempo_demo','ID Watsapp Message', 'Acount Businnes');
    console.log(response)
    res.status(201).send(response);
  }
  
}
