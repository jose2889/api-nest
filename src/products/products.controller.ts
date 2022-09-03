import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ForbiddenException, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { WhatsappCloudAPIRequest } from './dto/whatsapp-cloud-api-request.dto';

@Controller('chat')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('msg')
    sampleMovieTicketConfirmation(@Body() request: WhatsappCloudAPIRequest, @Res() response) {
        // this.logger.warn('consume-template');
        this.productsService.sendMessage(request).then( res => {
            response.status(HttpStatus.CREATED).json(res);
        }).catch((err) => {
            response.status(HttpStatus.BAD_REQUEST).json(err.response.data);
        })
    }

  @Post('webhook')
  createWebhook(@Body() data:any) {

    console.log("la data es ", {data});
    let createProductDto = new CreateProductDto();
    if (data.object) {
      if (
        data.entry &&
        data.entry[0].changes &&
        data.entry[0].changes[0] &&
        data.entry[0].changes[0].value.messages &&
        data.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id;
        let from = data.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload

        let type = data.entry[0].changes[0].value.messages[0].type;
        let name = data.entry[0].changes[0].value.contacts[0].profile.name;
        let timestamp = data.entry[0].changes[0].value.messages[0].timestamp;
        let watsapp_id = data.entry[0].changes[0].value.messages[0].id;

        if (type == "text") createProductDto.text = data.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        if (type == "button") createProductDto.text = data.entry[0].changes[0].value.messages[0].button.text; 
        createProductDto.from = from; 
        createProductDto.phone_number_id = phone_number_id; 
        createProductDto.name = name;
        createProductDto.type = type;
        createProductDto.timestamp = timestamp; 
        createProductDto.watsapp_id = watsapp_id; 

        // axios({
        //   method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        //   url:
        //     "https://graph.facebook.com/v12.0/" +
        //     phone_number_id +
        //     "/messages?access_token=" +
        //     token,
        //   data: {
        //     messaging_product: "whatsapp",
        //     to: from,
        //     text: { body: "Ack: " + msg_body },
        //   },
        //   headers: { "Content-Type": "application/json" },
        // });
        
     
      }
    } 
     return this.productsService.create(createProductDto);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    // console.log(paginationDto)
    return this.productsService.findAll( paginationDto );
  }


  @Get('webhook')
  authWebhook(@Res() res, @Query( 'hub.mode' ) mode: string, @Query( 'hub.verify_token' ) token: string, @Query( 'hub.challenge' ) challenge: string) {
     console.log("datos por parametro ", mode, token, challenge)
     /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
   const verify_token = process.env.VERIFY_TOKEN;

   // Parse params from the webhook verification request


  //  let mode = req.query["hub.mode"];
  //  let token = req.query["hub.verify_token"];
  //  let challenge = req.query["hub.challenge"];
 
   // Check if a token and mode were sent
   if (mode && token) {
     // Check the mode and token sent are correct
     if (mode === "subscribe" && token === verify_token) {
       // Respond with 200 OK and challenge token from the request
       console.log("WEBHOOK_VERIFIED");
       res.status(200).send(challenge);
     } else {
       // Responds with '403 Forbidden' if verify tokens do not match
       throw new ForbiddenException();
     }
   }
   res.status(400).send("Los datos no son validos");
  }

  @Get(':term')
  findOne(@Param( 'term' ) term: string) {
    return this.productsService.findOne( term );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update( id, updateProductDto );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productsService.remove( id );
  }
}
