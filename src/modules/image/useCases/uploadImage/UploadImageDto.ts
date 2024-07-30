export interface UploadImageRequestDto {
  bucket: string;
  image: string;
}

export interface UploadImageResponseDto {
  path: string;
}
