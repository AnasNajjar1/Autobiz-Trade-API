import {
  ApiResponse,
  LoginDto,
  RefreshDto,
  LogoutDto,
  UserInfoDto,
  ResetPasswordDto,
} from './ApiUserServiceDtos';

export interface IApiUserService {
  getUserInfos(userId: string): Promise<ApiResponse<UserInfoDto>>;
  login(username: string, password: string): Promise<ApiResponse<LoginDto>>;
  refresh(refreshToken: string): Promise<ApiResponse<RefreshDto>>;
  logout(loggedToken: string): Promise<ApiResponse<LogoutDto>>;
  resetPassword(username: string): Promise<ApiResponse<ResetPasswordDto>>;
}
