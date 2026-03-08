import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import {
  ItemInterface,
  FolioCollectionInterface,
} from "../../domain/collection/folio.collection.interface";
import { SetServiceCostActiveServiceInterface } from "../../../folio/domain/services/set-service-cost-active.interface";

export class SetServiceCostActiveService
  implements SetServiceCostActiveServiceInterface
{
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(
    folio: string,
    service_cost: string
  ): Promise<FolioCollectionInterface | null> {
    const current_folio = await this.FolioRepository.findFolioByFolio(folio);
    if (!current_folio?._id) {
      throw new Error("Folio no encontrado");
    }
    try {
      await this.FolioRepository.setActiveServiceCost(
        current_folio._id.toString(),
        service_cost
      );
    } catch (error) {
      throw new Error("Error al actualizar el folio");

    }
    return current_folio;
  }
}
