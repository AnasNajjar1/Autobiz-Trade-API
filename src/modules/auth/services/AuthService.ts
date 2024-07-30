const axios = require('axios');
import AWS from 'aws-sdk';

const cognitoidentity = new AWS.CognitoIdentity({ apiVersion: '2014-06-30' });

export async function getAutobizToken(username, password) {
  const headers = {
    'Content-Type': 'application/json',
    Username: username,
    Password: password,
  };

  try {
    const autobizAuth = await axios.post(
      `${process.env.autobizApiPath}/users/v1/auth?refresh=true`,
      null,
      { headers: headers },
    );
    return autobizAuth;
  } catch (e) {
    const userNotFound = e.response.data?.code;
    if (userNotFound === 'UserNotFound') throw Error('UserNotFound');
    throw Error(e.response.data.message);
  }
}

export function userAuthorized(userRoles) {
  return (
    userRoles.includes('adminCarcheck') ||
    userRoles.includes('managerCarcheck') ||
    userRoles.includes('buyerCarcheck') ||
    userRoles.includes('autobizTrade')
  );
}

export async function getAwsToken(userId) {
  const tokenDuration = 3600 * 1; //seconds, up to 1 hours

  const params = {
    IdentityPoolId: process.env.identityPoolId,
    Logins: {
      [process.env.developerAuthProvider]: userId,
    },
    TokenDuration: tokenDuration,
  };
  const tokenAws: any = await cognitoidentity
    .getOpenIdTokenForDeveloperIdentity(params)
    .promise();

  return {
    identityId: tokenAws.IdentityId,
    token: tokenAws.Token,
    tokenDuration,
  };
}

export async function refreshAutobizToken(refreshToken) {
  const headers = {
    'X-Refresh-Token': refreshToken,
  };

  try {
    const autobizAuth = await axios.post(
      `${process.env.autobizApiPath}/users/v1/refresh`,
      null,
      { headers: headers },
    );
    return autobizAuth;
  } catch (e) {
    const userNotFound = e.response.data?.code;
    if (userNotFound === 'UserNotFound') throw Error('UserNotFound');
    throw Error(e.message);
  }
}

export function getUserId(event) {
  //send API Gateway event to get user id
  try {
    const cognitoAuthenticationProvider =
      event.requestContext.identity.cognitoAuthenticationProvider;
    //if multiple provider, check the auth provider
    const userId = cognitoAuthenticationProvider.split(':').pop();
    return userId;
  } catch (e) {
    console.warn('cannot identify user in autobiz APIV2', e.message);

    const accessKey =
      event?.requestContext?.identity?.accessKey ?? 'Not_identified';
    // const accessKey = _.get(
    //   event,
    //   'requestContext.identity.accessKey',
    //   'Not_identified',
    // );
    console.warn('accessKey', accessKey);
    return accessKey;
  }
}
