export interface RefreshTokenResponseDto {
  accessToken: string;
  typeToken: string;
  expiresOn: any;
  user: any;
  awsIdentity: AwsIdentity;
}

export interface AwsIdentity {
  identityId: string;
  token: string;
  tokenDuration: number;
  domain: string;
}
