const AWS = require('aws-sdk');
import { v1 as uuidv1 } from 'uuid';
import stream from 'stream';
const s3 = new AWS.S3();

async function s3Lib(action, params) {
  return await s3[action](params).promise();
}

export async function s3LibCreateStream(action, params) {
  const s3 = new AWS.S3();
  return await s3[action](params).createReadStream();
}

export async function copyImage(sourcekey) {
  const key = `carcheck/${sourcekey}`;

  const copyparams = {
    Bucket: process.env.imageBucket,
    CopySource: `${process.env.carcheckImageBucket}/inspection/${sourcekey}`,
    Key: key,
    ACL: 'public-read',
    CacheControl: 'max-age = 864000',
  };
  await s3Lib('copyObject', copyparams);

  return `https://${process.env.imageBucket}.s3-eu-west-1.amazonaws.com/${key}`;
}

export async function saveFile(file, name) {
  const generateKey = uuidv1();
  const key = `carcheck/${name}/${generateKey}.pdf`;
  const bucket = process.env.imageBucket;

  const params = {
    Body: file,
    Bucket: bucket,
    Key: key,
    ACL: 'public-read',
    ContentType: 'application/pdf',
    CacheControl: 'max-age = 864000',
  };
  await s3Lib('putObject', params);

  return `https://${bucket}.s3-eu-west-1.amazonaws.com/${key}`;
}

export async function savePartnerBody(file, partner, requestId) {
  let date = new Date();
  const key = `partners/${partner}/${date.getFullYear()}${date.getMonth()}/${requestId}.json`;
  const bucket = process.env.imageBucket;

  const params = {
    Body: file,
    Bucket: bucket,
    Key: key,
  };
  await s3Lib('putObject', params);

  return `https://${bucket}.s3-eu-west-1.amazonaws.com/${key}`;
}

export const uploadStream = ({ Bucket, Key, ACL, ContentType }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3
      .upload({ Bucket, Key, Body: pass, ACL, ContentType })
      .promise()
      .then((data) => {
        return data.Location;
      })
      .catch((err) => console.log(err)),
  };
};


export default s3Lib;
