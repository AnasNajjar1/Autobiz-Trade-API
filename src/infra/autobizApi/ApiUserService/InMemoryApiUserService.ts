import { IApiUserService } from './IApiUserService';
import { left, Result, right } from '../../../core/logic/Result';
import {
  UserInfoDto,
  ApiResponse,
  LoginDto,
  RefreshDto,
  LogoutDto,
  ResetPasswordDto,
} from './ApiUserServiceDtos';
import { ApiUserServiceErrors } from './ApiUserServiceErrors';

export class InMemoryApiUserService implements IApiUserService {
  private users: any[];
  constructor(users: any[]) {
    this.users = users;
  }

  async getUserInfos(userId: string): Promise<ApiResponse<UserInfoDto>> {
    const users = this.users.filter((u) => u.id === userId);
    if (users.length === 0) {
      return left(new ApiUserServiceErrors.UserNotFound());
    }
    return right(Result.ok(users[0]));
  }

  async login(
    username: string,
    password: string,
  ): Promise<ApiResponse<LoginDto>> {
    const users = this.users.filter(
      (u) => u.username === username && u.password === password,
    );
    if (users.length === 0) {
      return left(new ApiUserServiceErrors.UserNotFound());
    }
    return right(
      Result.ok({
        accessToken: '',
        refreshToken: '',
        typeToken: '',
        expiresOn: '',
        user: users[0],
      }),
    );
  }

  async refresh(refreshToken: string): Promise<ApiResponse<RefreshDto>> {
    return right(
      Result.ok({
        accessToken: '',
        typeToken: '',
        expiresOn: '',
        user: this.users[0],
      }),
    );
  }

  async logout(loggedToken: string): Promise<ApiResponse<LogoutDto>> {
    return right(
      Result.ok({
        status: true,
      }),
    );
  }

  async resetPassword(
    username: string,
  ): Promise<ApiResponse<ResetPasswordDto>> {
    return right(
      Result.ok({
        message: 'success',
      }),
    );
  }
}
