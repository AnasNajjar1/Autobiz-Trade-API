import { v4 as uuidv4 } from 'uuid';
import {
  success,
  unknown,
} from '../../../../infra/http/deprecated/response-lib';
import pushVehicle from './pushVehicle';

import models from '../../../../infra/sequelize/models';
import { decodeString } from '../../../../shared/helpers/others/StringDecoder';

export default async function main(event, context) {
  const { body } = event;
  const data = JSON.parse(body);
  const { partnerId, vehicleId, comment } = data;
  const saleComment = decodeString(comment);

  if (!vehicleId) {
    return unknown({ status: false, message: 'vehicleId is not defined.' });
  }

  if (!partnerId) {
    return unknown({ status: false, message: 'partnerId is not defined.' });
  }

  const uuid = await createRequest(vehicleId, partnerId, saleComment);

  let result;

  try {
    result = await pushVehicle(vehicleId, partnerId, uuid, saleComment);

    console.warn('success');
  } catch (e) {
    console.warn('fail', e);
    const statusId = 2; //failed
    const comment = e.message;
    await updateRequest(uuid, statusId, comment);
    return unknown({ status: false, error: `not created. ${comment}` });
  }
  const statusId = 1; //submitted
  await updateRequest(uuid, statusId, result.message);

  return success(result);
}

async function createRequest(vehicleId, partnerId, saleComment) {
  const statusId = 5; //submitting
  const uuid = uuidv4();

  const partnerRequest = await models.partnerrequest.create({
    partnerId,
    vehicleId,
    statusId,
    uuid,
    saleComment,
  });

  const requestId = partnerRequest.id;

  if (!requestId) {
    throw Error('fail create request');
  }

  return uuid;
}

async function updateRequest(uuid, statusId, comment) {
  if (typeof comment !== 'string') comment = '';

  await models.partnerrequest.update(
    { comment, statusId },
    {
      where: {
        uuid,
      },
    },
  );

  return;
}
