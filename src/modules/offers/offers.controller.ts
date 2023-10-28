import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: Offer,
    status: 201,
  })
  @ApiResponse({
    description: 'Нельзя скидываться себе на подарок',
    status: 409,
  })
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: IUserRequest,
  ): Promise<Offer> {
    return await this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  @ApiResponse({
    type: Offer,
    isArray: true,
    status: 200,
  })
  async findAll(): Promise<Offer[]> {
    return await this.offersService.findAll({
      relations: { user: true, item: true },
    });
  }

  @Get(':id')
  @ApiResponse({
    type: Offer,
    status: 200,
  })
  @ApiResponse({
    description: 'Подарок с id: #{id} не найден',
    status: 404,
  })
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Offer> {
    return await this.offersService.findOne(id, {
      relations: { user: true },
    });
  }
}
