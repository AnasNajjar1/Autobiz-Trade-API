import {
  success,
  failure,
} from '../../../../infra/http/deprecated/response-lib';
import { get, inRange } from 'lodash';

import models from '../../../../infra/sequelize/models';
import { decodeString } from '../../../../shared/helpers/others/StringDecoder';

export default async function main(event, context) {
  const { pathParameters } = event;
  const postData = JSON.parse(event.body);

  let offerIsValid = true;
  const uuid = get(pathParameters, 'uuid', false);

  if (!uuid)
    return failure({
      status: false,
      error: `arf :poop:, we need the identification id in the path : partnerOffer/{id}`,
    });

  let value = get(postData, 'value', false);
  value = parseInt(value);

  let comment = get(postData, 'comment', null);

  if (value === 0 && !value && !comment) {
    return failure({
      status: false,
      error: `please give us an value or comment at least in the POST body ! ex : { "value" : 1000, "comment" : "we love your cars" }`,
    });
  }

  const ipSource = getIpFromContext(context);

  if (!value || !inRange(value, 1, 1000000)) {
    offerIsValid = false;
  }

  //get partnerRequestId from request uuid
  const partnerrequest = await models.partnerrequest.findOne({
    where: { uuid },
  });

  if (!partnerrequest) {
    return failure({
      status: false,
      error: `arf :poop:, we don't know this id : ${uuid}`,
    });
  }

  const queryOffer = await models.partneroffer.create({
    value,
    partnerRequestId: partnerrequest.id,
    comment: decodeString(comment),
    ipSource,
  });

  try {
    if (offerIsValid) {
      await partnerrequest.update({ statusId: 3 });
    } else {
      await partnerrequest.update({ statusId: 4 });
    }

    if (offerIsValid) {
      return success({ message: `Got your offer !` });
    } else {
      return success({
        message: `So you don't want our car, you offered no value...received`,
      });
    }
  } catch (error) {
    return failure({
      status: false,
      error: `arf :poop:, something unexpected happened, we didn't get your offer`,
    });
  }
}

function getIpFromContext(context) {
  const ip = get(context, 'identity.sourceIp', null);
  if (typeof ip === 'string') return ip;
  else return null;
}
