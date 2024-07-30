import vpauto from './format/vpauto/main';
import getVehicle from './getVehicle';

async function main(vehicleId, partnerId, uuid, saleComment) {
  const [vehicle, autobizPosId] = await getVehicle(vehicleId);
  vehicle.request = uuid;
  vehicle.salesComment = saleComment;

  switch (partnerId) {
    case 1:
      return vpauto(vehicle, autobizPosId);
    default:
      throw Error('unknown partner');
  }
}

export default main;
