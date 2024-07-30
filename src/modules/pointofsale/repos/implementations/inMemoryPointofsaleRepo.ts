import { IPointofsaleRepo } from '../pointofsaleRepo';
import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { Pointofsale, PointofsaleProps } from '../../domain/pointofsale';

export class InMemoryPointofsaleRepo implements IPointofsaleRepo {
  private mockedPointofsales;

  public constructor(mock: any) {
    this.mockedPointofsales = mock;
  }

  public getPointofsaleById(id: number) {
    const pointofsale = this.mockedPointofsales.find((x) => x.id === id);

    if (!!pointofsale === false) throw new Error('pointofsale not found.');
    return Promise.resolve(PointofsaleMap.toDomain(pointofsale));
  }

  public getPointofsaleByAutobizId(autobizPosId: string) {
    const pointofsale = this.mockedPointofsales.find(
      (x) => x.autobizPosId === autobizPosId,
    );

    if (pointofsale) {
      return Promise.resolve(PointofsaleMap.toDomain(pointofsale));
    } else {
      return null;
    }
  }

  public getPointofsaleByUuid(uuid: string) {
    const pointofsale = this.mockedPointofsales.find((x) => x.uuid === uuid);

    if (!!pointofsale === false) throw new Error('pointofsale not found.');
    return Promise.resolve(PointofsaleMap.toDomain(pointofsale));
  }

  public deletePointofsaleById(id: number) {
    const pointofsale = this.mockedPointofsales.find((x) => x.id === id);

    if (!pointofsale) {
      throw new Error('Pointofsale not found.');
    }

    this.mockedPointofsales = this.mockedPointofsales.filter(
      (x) => x.id !== id,
    );

    const found = this.mockedPointofsales.find((x) => x.id === id);

    if (found) {
      throw new Error('Pointofsale not deleted.');
    } else {
      return Promise.resolve(true);
    }
  }

  async exists(id: number): Promise<boolean> {
    const found = this.mockedPointofsales.find((x) => x.id === id);

    if (found) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  async save(pointofsale: Pointofsale) {
    let exists = false;
    const raw = await PointofsaleMap.toPersistence(pointofsale);
    if (pointofsale.id) {
      exists = await this.exists(pointofsale.id);
    }

    if (exists) {
      return;
    } else {
      raw.id = this.mockedPointofsales.length + 1;
      this.mockedPointofsales.push(raw);

      return Promise.resolve(PointofsaleMap.toDomain(raw));
    }
  }

  public getPointofsales(searchQuery: any) {
    const pointofsales = this.mockedPointofsales;

    const result = {
      limit: 24,
      offset: 0,
      rows: pointofsales.map((p) => PointofsaleMap.toDomain(p)),
      count: this.mockedPointofsales.length,
    };

    return Promise.resolve(result);
  }

  public getOnlinePointofsalesListByUser(searchQuery: any) {
    const pointofsales = this.mockedPointofsales;

    const result = {
      limit: 24,
      offset: 0,
      rows: pointofsales.map((p) => PointofsaleMap.toDomain(p)),
      count: this.mockedPointofsales.length,
    };

    return Promise.resolve(result);
  }

  public findPointofsale(searchQuery: any) {
    const pointofsales = this.mockedPointofsales;
    const row = pointofsales.filter(
      (x) =>
        x?.name === searchQuery.name &&
        x?.country === searchQuery.country &&
        x?.city === searchQuery.city &&
        x?.zipCode === searchQuery.zipCode,
    );
    if (row.length) {
      return Promise.resolve(PointofsaleMap.toDomain(row[0]));
    }

    return null;
  }
}
