export type Image = string;

export interface IImageService {
  get(bucket: string, imageId: string): Promise<Image>;
  set(bucket: string, image: Image): Promise<any>;
}
