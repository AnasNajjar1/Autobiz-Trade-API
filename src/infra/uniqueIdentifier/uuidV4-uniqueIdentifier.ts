import { v4 as uuidv4 } from 'uuid';
import { UniqueEntityId } from '../../core/domain/UniqueEntityID';

export class UuidUniqueEntityId implements UniqueEntityId {
  public generate(): string {
    return uuidv4();
  }
}
