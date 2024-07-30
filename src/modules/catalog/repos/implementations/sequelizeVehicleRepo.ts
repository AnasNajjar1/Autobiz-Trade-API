import { IVehicleRepo } from '../vehicleRepo';
import { VehicleMap } from '../../mappers/VehicleMap';
import { Vehicle } from '../../domain/vehicle';
import {
  formatRegistration,
  formatRegistrationWithoutDash,
} from '../../../../shared/helpers/VehicleHelper';
import { Op, literal } from 'sequelize';

export class SequelizeVehicleRepo implements IVehicleRepo {
  private models: any;

  public constructor(models: any) {
    this.models = models;
  }

  async exists(id: number): Promise<boolean> {
    const vehicle = await this.models.vehicle.findOne({
      where: {
        id,
      },
    });
    return !!vehicle === true;
  }

  public async save(vehicle: Vehicle): Promise<number> {
    const raw = await VehicleMap.toPersistence(vehicle);

    let exists: boolean = false;
    if (vehicle?.id) {
      exists = await this.exists(vehicle.id);
    }

    let sequelizeModel;

    try {
      if (!exists) {
        sequelizeModel = await this.models.vehicle.create(raw);
      } else {
        await this.models.vehicle.update(raw, {
          where: {
            id: vehicle.id,
          },
          individualHooks: true,
        });

        sequelizeModel = await this.models.vehicle.findOne({
          where: { id: vehicle.id },
        });
      }
    } catch (error) {
      console.warn(error);
      throw new Error('Vehicle save error.');
    }

    return sequelizeModel.id;
  }

  public async delete(id: number, user: string) {
    const vehicle = await this.models.vehicle.findOne({ where: { id } });
    const found = !!vehicle === true;

    if (!found) throw new Error('vehicle not found');

    await this.models.vehicle.update(
      { deletedBy: user },
      {
        where: {
          id,
        },
      },
    );

    return this.models.vehicle.destroy({
      where: { id },
      individualHooks: true,
    });
  }

  public async getAdminVehicleById(id: number) {
    const vehicle = await this.models.vehicle.findOne({
      include: [this.models.pointofsale],
      where: { id },
    });
    const found = !!vehicle === true;

    if (!found) throw new Error('vehicle not found');
    return VehicleMap.toDomain(vehicle);
  }

  public async getAdminVehicleByRegistration(registration: string) {
    if (!registration) throw new Error('no registration');
    const vehicle = await this.models.vehicle.findOne({
      where: { registration },
    });
    const found = !!vehicle === true;

    if (found) {
      return VehicleMap.toDomain(vehicle);
    }
    return null;
  }

  public async getLastVehicleByRegistration(registrationLike: string) {
    if (!registrationLike) throw new Error('no registration');
    const whereVehicle = {};
    if (registrationLike) {
      whereVehicle['registration'] = {
        [Op.or]: [
          { [Op.substring]: registrationLike },
          {
            [Op.substring]: formatRegistration('XX-XXX-XX', registrationLike),
          },
          {
            [Op.substring]: formatRegistrationWithoutDash(registrationLike),
          },
        ],
      };
    }
    const vehicle = await this.models.vehicle.findOne({
      where: whereVehicle,
      order: [['createdAt', 'DESC']],
    });
    const found = !!vehicle === true;

    if (!found) throw new Error('vehicle not found');
    return VehicleMap.toDomain(vehicle);
  }

  public async getLastVehicleByVin(vin: string) {
    if (!vin) throw new Error('no vin');
    const vehicle = await this.models.vehicle.findOne({
      where: { vin },
      order: [['createdAt', 'DESC']],
    });
    const found = !!vehicle === true;

    if (!found) throw new Error('vehicle not found');
    return VehicleMap.toDomain(vehicle);
  }

  public async getAdminVehiclesList(searchQuery?: any) {
    const { limit } = searchQuery || 12;
    const { offset } = searchQuery || 0;

    let { sortBy } = searchQuery || {};
    sortBy = sortBy ? sortBy : 'id';
    sortBy = sortBy.split('.').slice(-1);
    let { sortOrder } = searchQuery || {};
    sortOrder = sortOrder ? sortOrder : 'desc';

    const { filter } = searchQuery || {};
    const whereVehicle = {};

    const {
      fileNumber,
      fileNumberLike,
      registrationLike,
      registration,
      q,
      id,
      createdAtInterval,
      pointOfSaleId,
    } = filter || {};
    if (createdAtInterval) {
      whereVehicle['createdAt'] = {
        [Op.between]: createdAtInterval,
      };
    }

    if (fileNumberLike) {
      whereVehicle['fileNumber'] = {
        [Op.substring]: fileNumberLike,
      };
    }

    if (fileNumber) {
      whereVehicle['fileNumber'] = fileNumber;
    }

    if (registrationLike) {
      whereVehicle['registration'] = {
        [Op.or]: [
          { [Op.substring]: registrationLike },
          {
            [Op.substring]: formatRegistration('XX-XXX-XX', registrationLike),
          },
          {
            [Op.substring]: formatRegistrationWithoutDash(registrationLike),
          },
        ],
      };
    }

    if (registration) {
      whereVehicle['registration'] = registration;
    }

    if (q) {
      whereVehicle['fileNumber'] = {
        [Op.substring]: q,
      };
    }

    if (id) {
      if (typeof id === 'string') {
        whereVehicle['id'] = id;
      }
      if (typeof id === 'object') {
        whereVehicle['id'] = {
          [Op.in]: id,
        };
      }
    }

    if (pointOfSaleId) {
      whereVehicle['pointOfSaleId'] = pointOfSaleId;
    }

    const query = await this.models.vehicle.findAndCountAll({
      include: [this.models.pointofsale],
      limit,
      offset,
      where: whereVehicle,
      order: [[literal(sortBy + ' ' + sortOrder)]],
    });

    const pagination = {
      limit,
      offset,
      rows: query.rows.map((v) => VehicleMap.toDomain(v)),
      count: query.count,
    };

    return pagination;
  }
}
