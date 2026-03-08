import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import {
  FolioCollectionInterface,
} from "../../domain/collection/folio.collection.interface";
import { SetQuoteActiveServiceInterface } from "../../../folio/domain/services/set-quote-active.interface";

export class SetQuoteActiveService
  implements SetQuoteActiveServiceInterface
{
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(
    folio: string,
    quote: string
  ): Promise<FolioCollectionInterface | null> {
    const current_folio = await this.FolioRepository.findFolioByFolio(folio);
    if (!current_folio?._id) {
      throw new Error("Folio no encontrado");
    }
    try {
      await this.FolioRepository.setActiveQuote(
        current_folio._id.toString(),
        quote
      );
    } catch (error) {
      throw new Error("Error al actualizar el folio");

    }
    return current_folio;
  }
}
