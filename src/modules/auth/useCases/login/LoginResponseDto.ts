export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  typeToken: string;
  expiresOn: string;
  user: any;
  links?: any;
  awsIdentity: AwsIdentity;
}

export interface AwsIdentity {
  identityId: string;
  token: string;
  tokenDuration: number;
  domain: string;
}
