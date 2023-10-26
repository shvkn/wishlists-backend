import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { WishlistsService } from '../wishlists/wishlists.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const entityClassName = context.getClass();
    const request = await context.switchToHttp().getRequest();
    const id = request.params.id;
    const user = request.user;
    let entity: Wishlist | Wish;
    switch (entityClassName.name) {
      case 'WishlistsController':
        entity = await this.wishlistsService.findOne(+id, {
          owner: true,
        });
        break;
      case 'WishesController':
        entity = await this.wishesService.findOne(+id, {
          owner: true,
        });
        break;
      default:
        throw new Error('Error at OwnerGuard');
    }
    if (entity && user && entity.owner.id === user.id) {
      return true;
    }
    throw new UnauthorizedException('Access denied');
  }
}
