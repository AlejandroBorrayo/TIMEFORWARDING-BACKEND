import type { ApikeyRepositoryInterface } from '../../domain/repositories/apikey-repository.interface';
import type { FindApikeyByServiceInterface } from '../../domain/services/find-apikey-by-service.interface';
import type { ApikeyCollectionInterface } from '../../domain/collection/apikey.interface';

export class FindApikeyByApikeyService implements FindApikeyByServiceInterface {
  constructor(private readonly repository: ApikeyRepositoryInterface) {}

  async run(apikey: string): Promise<ApikeyCollectionInterface> {
    try {
      const apikeyFound = await this.repository.findOneById(apikey);

      if (!apikeyFound) {
        const error: any = new Error('API key not found');
        error.status = 404;
        throw error;
      }

      return apikeyFound;
    } catch (error: any) {
      console.error('[FindApikeyByApikeyService]', error);
      if (!error.status) {
        error.status = 500;
      }
      throw error;
    }
  }
}
