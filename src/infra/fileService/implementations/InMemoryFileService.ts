import { IFileService } from '../FileService';

export class InMemoryFileService implements IFileService {
  // public getImage(sourcekey: string) {
  //   if (sourcekey.length != 0) {
  //     return Promise.resolve({
  //       sourcekey: 'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/35843/cecf997d-4368-4ad8-bd84-fccd2215a63f.jpg',
  //     });
  //   }

  //   throw new Error('Cant find picutre from this key.');
  // }
  private mockdata;
  public constructor(Excel?) {
    this.mockdata = Excel || {};
  }
  public parseS3Url(url) {
    const splittedUrl = url.split('/');
    const bucket = splittedUrl[2].split('.')[0];
    const key = splittedUrl.slice(3).join('/');
    return { bucket, key };
  }

  public setImage(sourcekey: string, imageBuffer: Buffer) {
    if (sourcekey.length != 0 && imageBuffer.length != 0) {
      return Promise.resolve(true);
    }

    throw new Error('Buffer or Key is not correct.');
  }

  public setImageCompress(sourcekey: string, imageBuffer: Buffer) {
    if (sourcekey.length != 0 && imageBuffer.length != 0) {
      return Promise.resolve(sourcekey);
    }

    throw new Error('Buffer or Key is not correct.');
  }
  public async getExcel(uuid): Promise<any> {
    return Promise.resolve(this.mockdata[uuid]);
  }

  public async setExcel(body, uuid) {
    return `https://test.test.com/test`;
  }

  public async getArchive(link: string) {
    return Promise.resolve({
      'XX-XXX-XX': [
        {
          label: '1.jpg',
          link: 'https://www.picture_1.jpeg',
        },
        {
          label: '2.jpg',
          link: 'https://www.picture_2.jpeg',
        },
      ],

      'YY-YYY-YY': [
        {
          label: '1',
          link: 'https://www.picture_1.jpeg',
        },
        {
          label: '2.jpg',
          link: 'https://www.picture_2.jpeg',
        },
      ],
    });
  }
}
