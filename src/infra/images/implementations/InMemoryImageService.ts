import { IImageService } from '../imageService';
import _ from 'lodash';
import { v1 } from 'uuid';

export class InMemoryImageService implements IImageService {
  private images: any;

  constructor(images: any) {
    this.images = images;
  }

  async get(bucket, imageId) {
    return _.find(this.images, (img) => (img.imageId = imageId));
  }

  async set(bucket, image) {
    this.images.push({ imageId: v1(), content: image });
    return '';
  }
}
