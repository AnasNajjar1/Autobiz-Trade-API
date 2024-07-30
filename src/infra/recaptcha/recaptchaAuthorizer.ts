import { generatePolicy } from '../libs/security-lib';
import { ApiGoogleRecaptchaService } from './ApiGoogleRecaptchaService/ApiGoogleRecaptchaService';

export async function handler({ authorizationToken, methodArn }, _, callback) {
  try {
    const recaptchaToken = authorizationToken.replace('Bearer', '');
    if (!recaptchaToken) {
      const error = 'recaptcha_token_required';
      console.log(error);
      return callback(null, error);
    }

    const apiGoogleRecaptchaService = new ApiGoogleRecaptchaService();
    const verifyRecaptcha = await apiGoogleRecaptchaService.verify(
      recaptchaToken,
    );
    if (!verifyRecaptcha.value.getValue()) {
      const reVerifyRecaptcha = await apiGoogleRecaptchaService.verify(
        recaptchaToken,
        process.env.recaptchaInvisibleSecretKey,
      );
      if (reVerifyRecaptcha.value.getValue()) {
        return callback(
          null,
          generatePolicy(recaptchaToken, 'Allow', methodArn),
        );
      } else {
        const error = 'recaptcha_error';
        console.log(error);
        return callback(null, error);
      }
    }
    return callback(null, generatePolicy(recaptchaToken, 'Allow', methodArn));
  } catch ({ message }) {
    console.log(message);
    return callback(null, message);
  }
}
