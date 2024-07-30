import AWS from 'aws-sdk';
import { IMailerService } from './mailerService';
export class SESMailerService implements IMailerService {
  private SES;
  private replyTo;
  private from;
  public constructor() {
    this.SES = new AWS.SES({ region: 'eu-west-1' });
    this.replyTo = process.env.emailReplyTo;
    this.from = process.env.emailFrom;
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
        CcAddresses,
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

    const response = await this.SES.sendEmail(sesParams).promise();
    console.log('sent email to', ToAddresses);
    return sesParams;
  }
}
