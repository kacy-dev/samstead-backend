import { IUser } from '../../models/auth/User_model';

declare module 'express-serve-static-core' {
  interface Request {
    userData?: IUser;
  }
}
