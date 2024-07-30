import { DateTime } from 'aws-sdk/clients/devicefarm';
import { AppError } from '../../../core/logic/AppError';
import { Either, Result } from '../../../core/logic/Result';
import { ApiUserServiceErrors } from './ApiUserServiceErrors';

export type ApiErrorMessage =
  | AppError.UnexpectedError
  | ApiUserServiceErrors.UsernameAndPasswordRequired
  | ApiUserServiceErrors.UserNotAllowed
  | ApiUserServiceErrors.UserNotFound;

export type ApiResponse<T> = Either<ApiErrorMessage, Result<T>>;

export type Role = 'buyer' | 'admin' | null;

export interface LoginDto {
  accessToken: string;
  refreshToken?: string;
  typeToken: string;
  expiresOn: string;
  user: UserInfoDto;
}

export interface RefreshDto {
  accessToken: string;
  typeToken: string;
  expiresOn: string;
  user: UserInfoDto;
}

export interface LogoutDto {
  status: Boolean;
}

export interface ResetPasswordDto {
  message: string;
  code?: string;
}

export interface UserInfoDto {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  country: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: DateTime | string;
  createdBy?: string;
  updatedAt?: DateTime | string;
  updatedBy?: string;
  ownerId?: number;
  clientId?: number;
  dealershipId?: number;
  companyId?: number;
  groupId?: number;
  passwordExpiringDate?: DateTime | string;
  subscription?: object;
  subscriptionUser?: object;
  preferences?: object;
  brandId?: number;
  autobizUserId?: string;
  substituteId?: number;
  expiringDate?: string;
  concessionId?: number;
  groupConcessionId?: number;
  callCenterId?: number;
  subscriptionId?: number;
  subscriptionUserId?: number;
  language?: string;
  verticalId?: number;
  verticalName?: string;
  userType?: number;
  groupList?: object;
  defaultGroupList?: object;
  rateLimit?: object;
  roles?: string[];
  role?: Role;
}
