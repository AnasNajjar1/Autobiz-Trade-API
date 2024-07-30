import jwt from 'jsonwebtoken';
import { generatePolicy } from '../libs/security-lib';
import { apiUserService } from '../autobizApi/ApiUserService';

export class AuthorizerJwt {
  apiKey;

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  verify(jwtToken) {
    if (!jwtToken) {
      const error = 'token_is_required';
      throw Error(error);
    }

    const { data } = jwt.verify(jwtToken, this.apiKey);
    return data;
  }
}

export function handler({ authorizationToken = '', methodArn }, _, callback) {
  try {
    const { autobizApiKey } = process.env;

    const authorizerJwt = new AuthorizerJwt(autobizApiKey);
    const jwtToken = authorizationToken.substr(7);
    authorizerJwt.verify(jwtToken);

    const user = apiUserService.unserializeAutobizUser(jwtToken);
    const userRole = apiUserService.userAuthorized(user.roles);
    if (!userRole) {
      const error = 'not_authorized';
      throw Error(error);
    }
    return callback(
      null,
      generatePolicy(
        user.autobizUserId,
        'Allow',
        methodArn.split('/').slice(0, 2).join('/') + '/*',
      ),
    );
  } catch ({ message }) {
    console.log(message);
    return callback(null, generatePolicy('user', 'Deny', methodArn));
  }
}
