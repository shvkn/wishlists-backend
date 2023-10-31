import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { NotOwnerException } from '../error-exeptions/not-owner.exception';
import { WishesService } from '../modules/wishes/wishes.service';
import { WishlistsService } from '../modules/wishlists/wishlists.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
    private readonly moduleRef: ModuleRef,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const id = +request.params.id;
    const user = request.user;

    const contextClass = context.getClass();
    const featureName = contextClass.name.replace('Controller', '');
    const controllerDeps = Reflect.getMetadata(
      'design:paramtypes',
      contextClass,
    );
    const serviceRef = controllerDeps.find((dep) => {
      return dep.name?.match(featureName + 'Service');
    });
    const service = this.moduleRef.get(serviceRef, { strict: false });
    const entity = await service.findOne(id);
    if (!entity.owner) {
      throw new BadRequestException(
        `Wrong using of OwnerGuard. Entity "${featureName}" has no owner parameter.`,
      );
    }
    if (user?.id && entity.owner.id === user.id) {
      return true;
    }
    throw new NotOwnerException();
  }
}
