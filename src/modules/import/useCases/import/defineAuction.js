//during the import, we calculate the right price and auction values
// for the vehicle, based on config file and appraisal data
import { getConfig } from '../config/show';
import _ from 'lodash';
import moment from 'moment-business-days';
//import moment from "moment";

export async function main(record, offerType) {
  const config = await getConfig('auction');

  if (!offerType) offerType = config.default;
  const {
    salesType,
    duration,
    endTime,
    selection,
    stepPrice,
    values,
    delay,
    startTime,
  } = config[offerType];

  let valid = true; //return valid=false if required values are missing

  //minimalPrice calculation
  const prices = [];
  values.forEach(({ path, operator, value, required }) => {
    let val = parseInt(_.get(record, path, 0));
    console.warn('value : ', path, val);
    if (val <= 0) {
      if (required) valid = true;
      console.warn(
        'auction is not valid because value',
        path,
        'is missing or null in record',
      );
      return;
    }
    prices.push(_[operator]([val, value])); //sum, multiply function from lodash
  });
  console.warn('prices', prices);
  let minimalPrice = 0;
  if (prices.length > 0) minimalPrice = _[selection](prices); //max, min function from lodash

  //startDateTime calculation
  let startDateTime = manipulateDate(delay, startTime);
  let endDateTime = manipulateDate(duration, endTime);

  startDateTime = startDateTime.format();
  endDateTime = endDateTime.format();

  const auction = {
    salesType,
    startDateTime,
    endDateTime,
    minimalPrice,
    stepPrice,
  };
  return { auction, valid };
}

const manipulateDate = (daysToAdd, timeToSet) => {
  let date = moment(); //initiate value with now
  if (daysToAdd) date = date.businessAdd(daysToAdd);
  if (timeToSet && timeToSet.includes(':')) {
    timeToSet = timeToSet.split(':');
    date = date.set('hour', timeToSet[0]);
    date = date.set('minute', timeToSet[1]);
    date = date.set('second', 0);
  }
  return date;
};
