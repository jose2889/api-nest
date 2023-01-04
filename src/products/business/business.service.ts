import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateApiWSDto } from '../dto/create-api-ws.dto';
import { ApiWs } from '../entities/api_ws.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateApiWsDto } from '../dto/update-api-ws.dto';
import { countrytimezone } from '../data/country-timezone';

@Injectable()
export class BusinessService {
    apiWsRepository: any;
    logger: any;


    constructor (){}



    // ################################### Gestión de los datos en la tabla de las ApiWs para negocios ###################################
  // ########################################################## Edgardo Lugo ###########################################################

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

    console.log('Se mostro listado de negocios');
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
        .where('UPPER(phone_api) =:phone_api or slug_business =:slug_business or id_cuenta_business=: id_cuenta_business or country_business=:country_business or time_zone=:time_zone', {
          phone_api: term.toUpperCase(),
          slug_business: term.toLowerCase(),
        }).getOne();
    }


    if ( !business ) {
      console.log('Se mostro detalles del negocio con el termino de busqueda: ', term);
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

  public determineTimeZone(phone_number: string, acount_business: string){
    let timezone = 'UTC'; // zona horaria por defecto
    let codePhoneContry = 0; // codigo de pais por defecto
    let country = ""; // pais por defecto   
    let id_ws_acount = null; // id de la cuenta de whatsapp inicializado en null
    const dbCountry = countrytimezone; // base de datos de paises y zonas horarias
  
    id_ws_acount = this.findOnebusiness(acount_business); // busco el id de la cuenta de whatsapp en la base de datos de la api


    if (!id_ws_acount) { // si no se encuentra el id de la cuenta de whatsapp
      console.log ("⭕⭕ No se ha encontrado el ID de la cuenta de Whatsapp");
    } else { // si se encuentra el id de la cuenta de whatsapp
      console.log("⏩⏩ Negocio encontrado con el ID WhatsApp Business (",acount_business, "): ", id_ws_acount);
      country = id_ws_acount.country_business; // obtengo el pais del negocio de la base de datos de la api
      for (let i = 0; i < dbCountry.length; i++) {  // busco el pais en la base de datos de paises y zonas horarias
        if (dbCountry[i].pais == country) { // si el pais del negocio se encuentra en la base de datos
          timezone = dbCountry[i].timezone; // obtengo la zona horaria del pais del negocio
          codePhoneContry = dbCountry[i].code_phone; // obtengo el codigo de telefono del pais del negocio
          break; // salgo del ciclo
        }
      }
      console.log("⏩⏩ timezone: ", timezone); // imprimo la zona horaria del pais del negocio
      console.log("⏩⏩ codePhoneContry: ", codePhoneContry); // imprimo el codigo de telefono del pais del negocio
      console.log("⏩⏩ country: ", country); // imprimo el pais del negocio
    } 

    if (codePhoneContry == 0) { // si no se encuentra el pais del negocio
      console.log("⭕⭕ No se ha encontrado el pais del negocio");
      // A partir de aqui determino el pais del cliente a partir del numero de telefono del cliente que envia el mensaje
      if (phone_number.startsWith("1809") || phone_number.startsWith("1829") || phone_number.startsWith("1849")) {
        timezone = "America/Santo_Domingo";
        codePhoneContry = 1809;
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
    }
    
    return {timezone, codePhoneContry, country};
    
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
