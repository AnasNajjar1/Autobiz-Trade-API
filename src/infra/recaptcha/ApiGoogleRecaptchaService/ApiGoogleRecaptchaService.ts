import axios from 'axios';
import { left, Result, right } from '../../../core/logic/Result';
import {
  ApiResponse,
  IApiGoogleRecaptchaService,
} from './IApiGoogleRecaptchaService';

export class ApiGoogleRecaptchaService implements IApiGoogleRecaptchaService {
  secretKey;

  constructor() {
    this.secretKey = process.env.recaptchaSecretKey;
  }

  async verify(
    token: string,
    secret: string = this.secretKey,
  ): Promise<ApiResponse<boolean>> {
    try {
      const result = await axios({
        method: 'post',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        params: {
          secret,
          response: token,
        },
      });
      const { success } = result.data;
      return right(Result.ok(success));
    } catch (e) {
      return left(e.message ? e.message : e);
    }
  }
}
