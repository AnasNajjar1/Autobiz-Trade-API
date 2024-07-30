const aws = require('aws-sdk');
const sns = new aws.SNS({ region: 'eu-west-1' });

export function publishEvent(subject, data) {
  const params = {
    Message: JSON.stringify(data),
    Subject: subject,
    TopicArn: `arn:aws:sns:eu-west-1:473545627906:${process.env.emailTopicName}`,
  };
  return sns.publish(params).promise();
}
