import { pointofsaleRepo } from '..';
import { IPointofsaleBookmarkRepo } from '../pointofsaleBookmarkRepo';

export class SequelizePointofsaleBookmarkRepo
  implements IPointofsaleBookmarkRepo {
  private models: any;

  public constructor(models: any) {
    this.models = models;
  }

  private async getPointofsaleId(uuid) {
    const pointofsale = await this.models.pointofsale.findOne({
      attributes: ['id'],
      where: { uuid },
    });
    if (pointofsale?.id) {
      return pointofsale.id;
    } else {
      return null;
    }
  }

  public async add(uuid: string, userId: string): Promise<void> {
    const pointofsaleId = await this.getPointofsaleId(uuid);

    if (pointofsaleId && userId) {
      await this.models.pointofsalebookmark.findOrCreate({
        where: {
          userId,
          pointOfSaleId: pointofsaleId,
        },
      });
    }

    return;
  }

  public async remove(uuid: string, userId: string): Promise<void> {
    const pointofsaleId = await this.getPointofsaleId(uuid);

    if (pointofsaleId && userId) {
      await this.models.pointofsalebookmark.destroy({
        where: {
          userId,
          pointofsaleId,
        },
      });
    }

    return;
  }
}
