import { GroupName } from './groupName';

const generateString = (nbChar) => {
  return new Array(nbChar + 1).join('a');
};

describe('GroupName types', () => {
  it('a Group name should have between 2 and 255 characters', async () => {
    const result = GroupName.create(generateString(10));
    expect(result.isSuccess).toBe(true);
  });

  it('should generateString function works', async () => {
    expect(generateString(100).length).toBe(100);
  });

  it('a Group name is required', async () => {
    const result = GroupName.create(null);
    expect(result.isFailure).toBe(true);
  });

  it('a Group name must have at least 2 characters', async () => {
    const result = GroupName.create(generateString(1));
    expect(result.isFailure).toBe(true);
  });

  it('a Group name should not be longer than 255 characters', async () => {
    const result = GroupName.create(generateString(256));
    expect(result.isFailure).toBe(true);
  });
});
