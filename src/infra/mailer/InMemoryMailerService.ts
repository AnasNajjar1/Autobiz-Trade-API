import { IMailerService } from './mailerService';
export class InMemoryMailerService implements IMailerService {
  private SES;
  private replyTo;
  private from;
  public constructor() {
    this.replyTo = 'replyTo@test.fr';
    this.from = 'from@test.fr';
  }

  public async sendMail(
    to: string | string[],
    subject: string,
    content: string,
    CcAddresses?: string[],
  ) {
    const htmlBody = content;
    let ToAddresses = [to];
    if (Array.isArray(to)) ToAddresses = [...to];

    const sesParams = {
      Destination: {
        ToAddresses,
        CcAddresses
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: htmlBody,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      ReplyToAddresses: [this.replyTo],
      Source: `=?utf-8?B?${Buffer.from(this.from).toString('base64')}?= <${
        this.from
      }>`,
    };

    return sesParams;
  }
}
