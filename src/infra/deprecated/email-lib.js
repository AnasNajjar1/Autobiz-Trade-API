import AWS from 'aws-sdk';

export async function sendMail(params, content) {
  console.warn('send email', params, content);
  const SES = new AWS.SES({ region: 'eu-west-1' });

  const { to, from, reply_to: replyTo, subject } = params;
  const fromBase64 = Buffer.from(from).toString('base64');

  const htmlBody = content;
  let ToAddresses = [to];
  if (Array.isArray(to)) ToAddresses = [...to];

  const sesParams = {
    Destination: {
      ToAddresses: ToAddresses,
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
    ReplyToAddresses: [replyTo],
    Source: `=?utf-8?B?${fromBase64}?= <${from}>`,
  };

  const response = await SES.sendEmail(sesParams).promise();

  return;
}
