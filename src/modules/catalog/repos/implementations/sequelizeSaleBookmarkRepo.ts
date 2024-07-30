import { ISaleBookmarkRepo } from '../saleBookmarkRepo';

export class SequelizeSaleBookmarkRepo implements ISaleBookmarkRepo {
  private models: any;

  public constructor(models: any) {
    this.models = models;
  }

  private async getSaleId(uuid) {
    let sale;

    try {
      sale = await this.models.sale.findOne({
        attributes: ['id'],
        where: { uuid },
      });
    } catch (error) {
      console.warn('getSaleId Repo error', error);
    }

    if (sale?.id) {
      return sale.id;
    } else {
      return null;
    }
  }

  public async add(uuid: string, userId: string): Promise<void> {
    const saleId = await this.getSaleId(uuid);

    if (saleId && userId) {
      try {
        await this.models.salebookmark.findOrCreate({
          where: {
            userId,
            saleId,
          },
        });
      } catch (error) {
        console.warn('add repo error', error);
      }
    }

    return;
  }

  public async remove(uuid: string, userId: string): Promise<void> {
    const saleId = await this.getSaleId(uuid);

    if (saleId && userId) {
      try {
        await this.models.salebookmark.destroy({
          where: {
            userId,
            saleId,
          },
        });
      } catch (error) {
        console.warn('remove repo error', error);
      }
    }

    return;
  }
}
