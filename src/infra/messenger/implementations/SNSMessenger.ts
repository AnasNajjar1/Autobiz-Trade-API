import { IMessengerService, Message } from '../MessengerService';
import { SnsRequestMap } from './SnsRequestMap';

const aws = require('aws-sdk');
const sns = new aws.SNS({ region: 'eu-west-1' });

export class SNSMessenger implements IMessengerService {
  public async publishMessage(subject: string, data: any) {
    console.log('publish message', subject, data);
    const params = {
      Message: JSON.stringify(data),
      Subject: subject,
      TopicArn: `arn:aws:sns:eu-west-1:473545627906:${process.env.emailTopicName}`,
    };
    console.log('params', params);
    const snsRes = await sns.publish(params).promise();
    console.log('message published on ', process.env.emailTopicName, snsRes);
    return;
  }

  public receiveMessage(event: any): Message {
    console.log('receive message', event);
    return SnsRequestMap.toDomain(event);
  }
}
