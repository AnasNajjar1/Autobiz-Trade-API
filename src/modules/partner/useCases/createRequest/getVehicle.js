import models from '../../../../infra/sequelize/models';
import { VehicleMap } from '../../../catalog/mappers/VehicleMap';
import { VpAutoMap } from './format/vpauto/VpAutoMap';

export default async function (id) {
  try {
    const vehicleRaw = await models.vehicle.findOne({
      include: [models.pointofsale],
      where: { id },
    });
    const vehicle = VehicleMap.toDomain(vehicleRaw);
    const vehicleVpAuto = VpAutoMap.toVpAuto(vehicle);
    const { autobizPosId } = vehicle.pointofsale;
    return [vehicleVpAuto, autobizPosId];
  } catch (error) {
    console.warn(error);
  }
}
