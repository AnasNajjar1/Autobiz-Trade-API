import { UserAutobizUserId } from './userAutobizUserId';

describe('UserAutobizUserId types', () => {
  it('a User autobizUserId is required', async () => {
    const result = UserAutobizUserId.create(null);
    expect(result.isFailure).toBe(true);
  });

  it('a User autobizUserId with two uppercase characters, one underscore, and numbers is correct', async () => {
    const result = UserAutobizUserId.create('FR_123');
    expect(result.isSuccess).toBe(true);
  });

  //TODO: Fix this when add user won't accept undefined_undefined user
  // it('a User autobizUserId with something else than two uppercase characters, one underscore, and numbers is correct', async () => {
  //   const test1 = UserAutobizUserId.create('FR123');
  //   expect(test1.isFailure).toBe(true);

  //   const test2 = UserAutobizUserId.create('fr_123');
  //   expect(test2.isFailure).toBe(true);

  //   const test3 = UserAutobizUserId.create('foo');
  //   expect(test3.isFailure).toBe(true);

  //   const test4 = UserAutobizUserId.create('FR_');
  //   expect(test4.isFailure).toBe(true);

  //   const test5 = UserAutobizUserId.create('_123');
  //   expect(test4.isFailure).toBe(true);
  // });
});
