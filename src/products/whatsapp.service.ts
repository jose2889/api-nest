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
import dayjs from 'dayjs';
const date = dayjs(1662237384 * 1000).format("YYYY-MM-DD HH:mm");

@Injectable()
export class WhatsappService {

  private readonly logger = new Logger('ProductsService');
  baseUrl = BASEURL.baseUrlWhatsappCloudApiProd;
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

  async updateReservation(request: WhatsappCloudApiRequest): Promise<AxiosResponse<WhatsappCloudAPIResponse>> {
    const { data } = await firstValueFrom(this.httpService.post(this.baseUrl, request));
    console.log(data);
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
