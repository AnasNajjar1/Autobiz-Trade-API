import Axios from 'axios';
import { key, url, emailUsers } from './config';
import schema from './schema.json';
import Ajv from 'ajv';
import { savePartnerBody } from '../../../../../../infra/fileStorage/s3-lib';

export default async function (vehicle, autobizPosId) {
  vehicle.gallery = vehicle.gallery.filter((o) => o.key && o.value);
  vehicle.user = emailUsers(parseInt(autobizPosId), vehicle.pointOfSale.name);

  const validate = new Ajv().compile(schema);
  const isValid = validate(vehicle);
  if (!isValid) {
    throw new Error(
      `${validate.errors[0].dataPath} ${validate.errors[0].message}`,
    );
  }

  //save a copy of the body in S3 for debug and control
  await savePartnerBody(JSON.stringify(vehicle), 'vpauto', vehicle.request);

  try {
    const res = await Axios.post(
      `${url}/api/autobiz/estimation?key=${key}`,
      vehicle,
      { timeout: 25000 },
    );
    if (res.status > 299) throw new Error(res.data);
    console.warn('success', res.data);
    return res.data;
  } catch (e) {
    if (e.response?.data?.message_erreur) {
      throw new Error(e.response.data.message_erreur);
    }
    throw new Error('erreur lors de la transmission au partenaire');
  }
}
