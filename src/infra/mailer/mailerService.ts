export interface IMailerService {
  sendMail(
    to: string | string[],
    subject: string,
    content: string,
    CcAddresses?: string[],
  ): Promise<any>;
}
