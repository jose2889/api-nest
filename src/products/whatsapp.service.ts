import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Chat } from './entities/chat.entity';
import { validate as isUUID } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { WhatsappCloudApiRequest } from 'src/common/whatsapp-cloud-api-request.dto';
import { WhatsappCloudAPIResponse } from 'src/common/whatsapp-cloud-api-response.dto';
import { BASEURL } from 'src/common/api-resource';
import { AxiosResponse } from 'axios'
import * as dayjs from 'dayjs'


@Injectable()
export class WhatsappService {

  private readonly logger = new Logger('WhatsappService');
  baseUrl = BASEURL.baseUrlWhatsappCloudApiProd;
  urlPlanner = "https://api-keoagenda.herokuapp.com/api/webservices/services.reservations.in.beneficiaries/updateStatus?token="; 
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
    private readonly httpService:HttpService

  ) {}

  
  async sendMessage(request: WhatsappCloudApiRequest): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(this.httpService.post(this.baseUrl, request));
    console.log(data);
    return data;
  }

  async updateReservation(token: string): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {

    console.log("token recibido ", token);

    let body = {
      date: dayjs().format("YYYY-MM-DD HH:mm")
    }

    // try {
      const { data } = await firstValueFrom(this.httpService.put(this.urlPlanner+token, body));
      console.log("Response de planner", data);
    // } catch (error) {
    //     throw new BadRequestException();
    // }
    if (data.retCode === "1"){
      this.request.text.body = "Su reserva ha sido procesada con éxito. Gracias por su respuesta.";
    }else if (data.retCode === "1"){
      if (data.retMessage === "1") {
        this.request.text.body = "La reservación ya se encuentra aprobada previamente.";
      } else if (data.retMessage === "3") {
        this.request.text.body = "La reservación ya ha sido cancelada previamente.";
      } else if (data.retMessage === "9") {
        this.request.text.body = "Lo sentimos pero ya no puede cancelar la reserva, debido a que el tiempo previo permitido para cancelar ha sido superado.";
      }
    }else {
      this.request.text.body = "Gracias por su respuesta, su reserva sera gestionada a la brevedad y pronto sera contactado."; 
    }

    try {
      let response = await firstValueFrom(this.httpService.post(this.baseUrl, this.request));
      console.log("Response de whatapp API ", response.data);
    } catch (error) {
        throw new BadRequestException();
    }
    

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
      console.log("lo que consigue de product ", product)
      if ( !product ) {
        product = this.chatRepository.create(createProductDto);
        await this.chatRepository.save( product );
  
        return product;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.chatRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })
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
