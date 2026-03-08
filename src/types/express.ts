import { DecodedUser } from '../auth/domain/dto/decoded-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}
