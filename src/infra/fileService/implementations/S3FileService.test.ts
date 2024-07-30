import { InMemoryFileService } from './InMemoryFileService';

describe('test S3 getter setter implementation', () => {
  const S3Service = new InMemoryFileService();
  it('parse the S3 url to retrieve bucket and url', () => {
    const url =
      'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/38253/d7867e5d-92bc-43f7-aae5-7dec9588c007.jpg';
    const { bucket, key } = S3Service.parseS3Url(url);
    expect(bucket).toBe('b2b-pictures-prod');
    expect(key).toBe('carcheck/38253/d7867e5d-92bc-43f7-aae5-7dec9588c007.jpg');
  });
});
