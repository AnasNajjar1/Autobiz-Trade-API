import { UploadImageUseCase } from './UploadImageUseCase';
import { InMemoryImageService } from '../../../../infra/images/implementations/InMemoryImageService';

describe('Set Image in the admin us case', () => {
  let uploadImageUseCase;
  let imageService;
  const image = 'Pariatur elit cupidatat ea cillum enim ex.';
  const bucket = 'myBucket';

  beforeAll(() => {
    imageService = new InMemoryImageService([]);
    uploadImageUseCase = new UploadImageUseCase(imageService);
  });

  it('should upload image', async () => {
    const spyOnUploadImageService = jest.spyOn(imageService, 'set');
    const imageRes = await uploadImageUseCase.execute({
      bucket,
      image,
    });
    expect(imageRes.isRight()).toBe(true);
    expect(spyOnUploadImageService).toHaveBeenCalledWith(bucket, image);
  });
});
