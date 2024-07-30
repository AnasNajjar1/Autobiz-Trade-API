import s3Lib, {
  s3LibCreateStream,
  uploadStream,
} from '../../fileStorage/s3-lib';
import * as Excel from 'exceljs';
import { KeyGenerator } from '../../keyGenerator/keyGeneratorService';
import { IFileService } from '../FileService';
import { v4 as uuidv4 } from 'uuid';
import yauzl from 'yauzl';

export class S3FileService implements IFileService {
  // public async getImage(UrlSource) {
  //   //await s3Lib("getObject", getURLParams);
  //   //return `https://${process.env.imageBucket}.s3-eu-west-1.amazonaws.com/${key}`;
  //   return UrlSource;
  // }
  static parseS3Url(url) {
    const splittedUrl = url.split('/');
    const bucket = splittedUrl[2].split('.')[0];
    const key = splittedUrl.slice(3).join('/');
    return { bucket, key };
  }

  public async setImage(url, imageBuffer) {
    const { bucket, key } = S3FileService.parseS3Url(url);

    const params = {
      Bucket: bucket,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };
    await s3Lib('putObject', params);
    return true;
  }

  public async setImageCompress(url, imageBuffer) {
    const extension = url.split('.').pop();
    const key = `public/${KeyGenerator.uuid()}.${extension}`;
    const buket = process.env.imageBucket;
    const params = {
      Bucket: buket,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };
    await s3Lib('putObject', params);
    return `https://${buket}.s3-eu-west-1.amazonaws.com/${key}`;
  }

  public async setExcel(sheetBuffer: Buffer, uuid: string): Promise<string> {
    const key = `excelSheet/${uuid}.xlsx`;
    const bucket = process.env.imageBucket;

    const params = {
      Body: sheetBuffer,
      Bucket: bucket,
      Key: key,
      ACL: 'public-read',
      ContentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    await s3Lib('putObject', params);

    return `https://${bucket}.s3-eu-west-1.amazonaws.com/${key}`;
  }

  public async getExcel(uuid: string): Promise<[][]> {
    const bucket = process.env.imageBucket;
    const key = `excelSheet/${uuid}.xlsx`;

    const params = {
      Bucket: bucket,
      Key: key,
    };
    const stream = await s3LibCreateStream('getObject', params);
    return await this.loadWorkbook(stream);
  }

  private async loadWorkbook(stream: any): Promise<[][]> {
    const workbook = new Excel.Workbook();
    const content = await workbook.xlsx.read(stream);
    const worksheet = content.getWorksheet(1);
    const rows = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      rows.push(row.values);
    });
    return rows;
  }

  public async get(link: string): Promise<any> {
    try {
      const { bucket, key } = S3FileService.parseS3Url(link);
      const params = {
        Bucket: bucket,
        Key: key,
      };
      const data = await s3Lib('getObject', params);
      return data.Body;
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  public async getArchive(link: string): Promise<any> {
    try {
      const file = await this.get(link);
      const result = await this.extractZip(file);
      const data = result.reduce((key, value) => {
        key[value.registration] = key[value.registration] || [];
        key[value.registration].push({ label: value.label, link: value.link });
        return key;
      }, Object.create(null));
      return JSON.parse(JSON.stringify(data));
    } catch (err) {
      console.log(err);
      throw new Error(`Error getting archived file: ${err.message}`);
    }
  }

  private async extractZip(buffer: Buffer): Promise<any> {
    const result = [];
    return new Promise((resolve, reject) => {
      yauzl.fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
        if (err) reject(err);

        //read Zip file
        zipfile.readEntry();
        zipfile.on('entry', function (entry) {
          if (/\/$/.test(entry.fileName)) {
            // Directory file names end with '/'.
            // Note that entires for directories themselves are optional.
            // An entry's fileName implicitly requires its parent directories to exist
            zipfile.readEntry();
          } else {
            const fileNames = entry.fileName.split('.');
            const extension = fileNames[1];
            const path = fileNames[0].split('/');
            const registration = path[1];
            const label = path[2];
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) reject(err);
              const ContentType =
                extension === 'pdf' ? 'application/pdf' : 'image/jpg';

              const { writeStream, promise } = uploadStream({
                Bucket: process.env.imageBucket,
                Key: `public/${uuidv4()}.${fileNames[fileNames.length - 1]}`,
                ACL: 'public-read',
                ContentType,
              });

              readStream.pipe(writeStream);

              promise.then((link) => {
                result.push({ registration, label, link });
                zipfile.readEntry();
              });
            });
          }
        });
        zipfile.on('end', () => resolve(result));
      });
    });
  }
}
