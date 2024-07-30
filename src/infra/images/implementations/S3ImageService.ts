import { IImageService, Image } from '../imageService';
import AWS from 'aws-sdk';
import { KeyGenerator } from '../../keyGenerator/keyGeneratorService';
export const s3 = new AWS.S3();

async function s3Lib(action, params) {
  return await s3[action](params).promise();
}

export class S3ImageService implements IImageService {
  async get(imageBucket, imageId): Promise<Image> {
    const path = `public/${imageId}.jpeg`;

    const params = {
      Bucket: imageBucket,
      Key: path,
    };
    const { Body: buffer } = await s3Lib('getObject', params);
    const imageBase64 = buffer.toString('base64');

    return `data:image/jpeg;base64,${imageBase64}`;
  }

  async set(imageBucket, image): Promise<any> {
    const path = `public/${KeyGenerator.uuid()}.jpeg`;

    const body = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const params = {
      Bucket: imageBucket,
      Body: body,
      Key: path,
      ContentType: 'image/jpeg',
      Tagging: '',
    };
    await s3Lib('putObject', params);
    return path;
  }
}
