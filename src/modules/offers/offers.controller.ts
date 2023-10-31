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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ExceptionsMessages } from '../../utils/exception-messages.constants';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@Controller('offers')
@ApiTags('Offers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ description: 'Создание офера' })
  @ApiCreatedResponse({ type: Offer })
  @ApiBadRequestResponse({
    description: ExceptionsMessages.CANT_OFFER_YOUR_WISH,
  })
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @AuthorizedUser() user,
  ): Promise<Offer> {
    return await this.offersService.create(createOfferDto, user);
  }

  @Get()
  @ApiOperation({ description: 'Получение всех оферов' })
  @ApiOkResponse({ type: Offer, isArray: true })
  async findAll(): Promise<Offer[]> {
    return await this.offersService.findAll({
      relations: { user: true, item: true },
    });
  }

  @Get(':id')
  @ApiOperation({ description: 'Получение офера по ID' })
  @ApiOkResponse({ type: Offer })
  @ApiNotFoundResponse({ description: ExceptionsMessages.OFFER_NOT_FOUND })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Offer> {
    return await this.offersService.findOne({
      where: { id },
      relations: { user: true },
    });
  }
}
