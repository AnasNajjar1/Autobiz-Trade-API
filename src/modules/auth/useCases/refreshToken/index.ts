import { RefreshTokenController } from './RefreshTokenController';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';
import { apiUserService } from '../../../../infra/autobizApi/ApiUserService';

const refreshTokenUseCase = new RefreshTokenUseCase(apiUserService);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

const refreshTokenHandler = (event) => {
  return refreshTokenController.execute(event);
};

export { refreshTokenHandler, refreshTokenUseCase, refreshTokenController };
