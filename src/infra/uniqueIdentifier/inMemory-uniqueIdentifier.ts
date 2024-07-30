import { UniqueEntityId } from '../../core/domain/UniqueEntityID';

export class InMemoryUniqueEntityId implements UniqueEntityId {
  private count: number = 0;

  public generate(): string {
    this.count++;
    return `UID${this.count}`;
  }
}
