import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SwaggerTags } from '../../utils/swagger.constants';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@Controller('offers')
@ApiTags(SwaggerTags.OFFERS)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiCreatedResponse({
    type: Offer,
  })
  @ApiBadRequestResponse({
    description: 'Нельзя скидываться себе на подарок',
  })
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @AuthorizedUser() user,
  ): Promise<Offer> {
    return await this.offersService.create(createOfferDto, user);
  }

  @Get()
  @ApiOkResponse({
    type: Offer,
    isArray: true,
  })
  async findAll(): Promise<Offer[]> {
    return await this.offersService.findAll({
      relations: { user: true, item: true },
    });
  }

  @Get(':id')
  @ApiOkResponse({
    type: Offer,
  })
  @ApiNotFoundResponse({
    description: 'Подарок с id: #{id} не найден',
  })
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Offer> {
    return await this.offersService.findOne(id, {
      relations: { user: true },
    });
  }
}
