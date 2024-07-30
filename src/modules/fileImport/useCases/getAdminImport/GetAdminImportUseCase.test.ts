import { GetAdminImportUseCase } from './GetAdminImportUseCase';
import { InMemoryImportRepo } from '../../repos/implementations/inMemoryImportRepo';
import { Import } from '../../domain/import';
describe('Get Admin Import List By UserId', () => {
  let useCase;
  beforeEach(() => {
    const importRepo = new InMemoryImportRepo([
      new Import({
        id: 1,
        uuid: 'ssflksjfjklsf',
        status: 'finshed',
        notification: 'row 2:not created',
        link: 'http://wwww.test.com',
        createdBy: 'FR_1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Import({
        id: 2,
        uuid: 'ssflksjfjklsf',
        status: 'finshed',
        notification: 'row 2:not created',
        link: 'http://wwww.test.com',
        createdBy: 'FR_2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Import({
        id: 3,
        uuid: 'ssflksjfjklsf',
        status: 'finshed',
        notification: 'row 2:not created',
        link: 'http://wwww.test.com',
        createdBy: 'FR_1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]);
    useCase = new GetAdminImportUseCase(importRepo);
  });
  it('Should get Admin list by userId', async () => {
    const res = await useCase.execute({
      userId: 'FR_1',
      limit: 25,
      offset: 0,
      sortBy: 'id',
      sortOrder: 'ASC',
      filter: { createdBy: 'FR_1' },
    });

    expect(res.value.getValue().rows).toHaveLength(2);
    expect(res.value.getValue().count).toEqual(2);
  });
});
