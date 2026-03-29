import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import type { CreateFolioWithoutCostServiceInterface } from "../../domain/services/create-folio-without-cost-service.interface";
import type { CreateFolioWithoutCostDto } from "../../domain/dto/create-folio-without-cost.dto";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";

export class CreateFolioWithoutCostService
  implements CreateFolioWithoutCostServiceInterface
{
  private userRepository: UserRepositoryInterface;
  private folioRepository: FolioRepositoryInterface;

  constructor(
    userRepository: UserRepositoryInterface,
    folioRepository: FolioRepositoryInterface,
  ) {
    this.userRepository = userRepository;
    this.folioRepository = folioRepository;
  }

  async run(
    dto: CreateFolioWithoutCostDto,
  ): Promise<FolioCollectionInterface | null> {
    const seller_user = await this.userRepository.findByEmailOrId(
      dto.seller_userid,
    );
    if (!seller_user?._id) throw new Error("Seller not found");

    const folio = dto.folio.trim();
    if (!folio) throw new Error("Folio name is required");

    const existing = await this.folioRepository.findOne(folio);
    if (existing?._id) {
      throw new Error("A folio with this name already exists");
    }

    const folioData: FolioCollectionInterface = {
      seller_userid: new ObjectId(seller_user._id.toString()),
      company_id: new Types.ObjectId(dto.company_id),
      folio,
      service_cost: [],
    };

    const created = await this.folioRepository.create(folioData);
    if (!created?._id) throw new Error("Error creating folio");

    return this.folioRepository.findOne(folio);
  }
}
