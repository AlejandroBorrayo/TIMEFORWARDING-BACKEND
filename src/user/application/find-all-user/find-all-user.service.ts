// src/user/application/find-user.service.ts

import type { UserRepositoryInterface } from "../../domain/repository/user-repository.interface";
import type { FindAllUserServiceInterface } from "../..//domain/services/find-all-user-service.interface";
import type { UserCollectionInterface } from "../..//domain/collection/user.collection.interface";
import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";

export class FindAllUserService implements FindAllUserServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async run(
    _id: string,
    pagination: PageOptionsDto,
    search: string
  ): Promise<PageMetaDto<UserCollectionInterface>> {
    const user = await this.userRepository.findByEmailOrId(_id);
    if (user?.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    const [entities, total] = await this.userRepository.findAll(
      pagination,
      search
    );

    return new PageMetaDto<UserCollectionInterface>({
      total,
      pageOptions: pagination,
      records: entities,
    });
  }
}
