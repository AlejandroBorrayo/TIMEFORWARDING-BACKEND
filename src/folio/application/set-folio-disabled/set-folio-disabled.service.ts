import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { SetFolioDisabledServiceInterface } from "../../domain/services/set-folio-disabled-service.interface";
import type { SetFolioDisabledDto } from "../../domain/dto/set-folio-disabled.dto";

export class SetFolioDisabledService implements SetFolioDisabledServiceInterface {
  private folioRepository: FolioRepositoryInterface;

  constructor(folioRepository: FolioRepositoryInterface) {
    this.folioRepository = folioRepository;
  }

  async run(dto: SetFolioDisabledDto): Promise<FolioCollectionInterface | null> {
    const folioCode = dto.folio?.trim();
    if (!folioCode) throw new Error("folio es requerido");

    const current = await this.folioRepository.findFolioByFolio(folioCode);
    if (!current?._id) throw new Error("Folio no encontrado");

    const updated = await this.folioRepository.setFolioDisabled(
      current._id.toString(),
      dto.disabled,
    );
    if (!updated) throw new Error("No se pudo actualizar el folio");
    return updated;
  }
}
