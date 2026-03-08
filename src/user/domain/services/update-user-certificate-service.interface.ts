import type { UserCollectionInterface } from '../collection/user.collection.interface';


export interface UpdateUserCertificateServiceInterface {
  run(
    userid: string,
    file: Express.Multer.File,
  ): Promise<UserCollectionInterface | null>;
}
