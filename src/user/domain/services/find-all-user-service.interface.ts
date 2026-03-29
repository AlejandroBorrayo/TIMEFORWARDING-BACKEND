import type { PageMetaDto } from '../../../shared/domain/pagination/dto/page-meta.dto';
import type { UserCollectionInterface } from '../collection/user.collection.interface';
import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";

export const FIND_ALL_USER_SERVICE = Symbol('FindAllUserServiceInterface');

export interface FindAllUserServiceInterface {
  run(
    userid: string,
    pageOptionsDto: PageOptionsDto,
    search: string,
    company_id?: string,
  ): Promise<PageMetaDto<UserCollectionInterface>>;
}
