import { BaseApi } from '../../../core/infra/BaseApi';
import { left, Result, right } from '../../../core/logic/Result';
import { IApiUserService } from './IApiUserService';
import { unserialize } from 'php-unserialize';
import jwtDecode from 'jwt-decode';
import {
  ApiResponse,
  LoginDto,
  RefreshDto,
  LogoutDto,
  UserInfoDto,
  Role,
  ResetPasswordDto,
} from './ApiUserServiceDtos';
import { ApiUserServiceErrors } from './ApiUserServiceErrors';

export class ApiUserService extends BaseApi implements IApiUserService {
  constructor() {
    super(
      process.env.autobizApiPath + '/users/v1/',
      process.env.autobizApiSecretKey,
    );
  }

  async getUserInfos(userId: string): Promise<ApiResponse<UserInfoDto>> {
    const regex = new RegExp('^[a-zA-Z]+_([0-9]+)$');

    if (!regex.test(userId)) {
      return left(new ApiUserServiceErrors.WrongUserId());
    }

    const userInfos = userId.split('_');
    const country = userInfos[0];
    const idCrm = userInfos[1];

    try {
      const response = await this.get(`users/${idCrm}?country=${country}`);
      return right(Result.ok(<UserInfoDto>{ ...response.data, country }));
    } catch (e) {
      return left(e.message ? e.message : e);
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<ApiResponse<LoginDto>> {
    try {
      const headers = {
        Username: username,
        Password: password,
      };
      const autobizAuth = await this.post(
        'auth?refresh=true&ver=2&application=autobizTrade&link=true',
        {},
        headers,
      );
      const user = this.unserializeAutobizUser(autobizAuth.data?.accessToken);

      const userRole = this.userAuthorized(user.roles);
      //check that the user is allowed to use the service
      if (!userRole) {
        return left(new ApiUserServiceErrors.UserNotAllowed());
      }

      return right(
        Result.ok(<LoginDto>{
          ...autobizAuth.data,
          user: { ...user, role: userRole },
        }),
      );
    } catch (e) {
      const error = e.code;
      if (error === 'UserNotFound')
        return left(new ApiUserServiceErrors.UserNotFound());
      return left(e.message ? e.message : e);
    }
  }

  async refresh(refreshToken: string): Promise<ApiResponse<RefreshDto>> {
    try {
      const headers = { 'X-Refresh-Token': refreshToken };
      const autobizAuth = await this.post('refresh?ver=2', {}, headers);

      const user = this.unserializeAutobizUser(autobizAuth.data.accessToken);

      const userRole = this.userAuthorized(user.roles);
      //check that the user is allowed to use the service
      if (!userRole) {
        return left(new ApiUserServiceErrors.UserNotAllowed());
      }

      return right(
        Result.ok(<RefreshDto>{
          ...autobizAuth.data,
          user: { ...user, role: userRole },
        }),
      );
    } catch (e) {
      const error = e.code;
      if (error === 'UserNotFound')
        return left(new ApiUserServiceErrors.UserNotFound());
      return left(e.message ? e.message : e);
    }
  }

  async logout(loggedToken: string): Promise<ApiResponse<LogoutDto>> {
    const headers = {
      Authorization: loggedToken.includes('Bearer')
        ? loggedToken
        : `Bearer ${loggedToken}`,
    };
    try {
      const response = await this.post('logout', {}, headers);
      return right(
        Result.ok({
          status: response.data.status,
        }),
      );
    } catch (e) {
      return left(e.message ? e.message : e);
    }
  }

  async resetPassword(
    username: string,
  ): Promise<ApiResponse<ResetPasswordDto>> {
    try {
      const response = await this.post(`users/password-reset/${username}`);
      return right(
        Result.ok(<ResetPasswordDto>{ message: response.data.message }),
      );
    } catch (e) {
      return left(e.message ? e.message : e);
    }
  }

  unserializeAutobizUser(accessToken: string): UserInfoDto {
    const infos: any = jwtDecode(accessToken);
    const { rules, country, userId, ...extendData } = unserialize(infos.data);
    if (!userId || !country) throw Error('UserNotFound');
    const roles = rules ? rules.split(':') : [];
    const autobizUserId = `${country}_${userId}`;
    return <UserInfoDto>{
      ...extendData,
      userId,
      country,
      autobizUserId,
      roles,
    };
  }

  userAuthorized(userRoles: string[]): Role {
    let role = null;
    userRoles.includes('adminCarcheck') ||
    userRoles.includes('managerCarcheck') ||
    userRoles.includes('autobizTrade')
      ? (role = 'admin')
      : userRoles.includes('buyerCarcheck')
      ? (role = 'buyer')
      : null;
    return <Role>role;
  }
}
