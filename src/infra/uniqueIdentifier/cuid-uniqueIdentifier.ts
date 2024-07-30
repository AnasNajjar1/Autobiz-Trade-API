import cuid from 'cuid';
import { UniqueEntityId } from '../../core/domain/UniqueEntityID';

export class CuidUniqueEntityId implements UniqueEntityId {
  public generate(): string {
    return cuid();
  }
}
