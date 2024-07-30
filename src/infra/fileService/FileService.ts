export interface IFileService {
  // getImage(key: string): Promise<Buffer>;
  setImage(key: string, imageBuffer: Buffer): Promise<boolean>;
  setImageCompress(key: string, imageBuffer: Buffer): Promise<string>;
  setExcel(imageBuffer: Buffer, uuid: string): Promise<string>;
  getExcel(uuid: string): Promise<any>;
  getArchive(link: string): Promise<any>;
}
