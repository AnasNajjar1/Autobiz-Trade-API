//import jp from "jsonpath";
import moment from 'moment';
import jp from '../../../../infra/deprecated/jsonpath.min';

export function transformJson(data, path) {
  let result = {};
  walk(data, path, result);
  return result;
}

function walk(data, path, result, key) {
  let fn;
  switch (type(path)) {
    case 'string':
      fn = seekSingle;
      break;

    case 'object':
      fn = seekObject;
      break;
  }

  if (fn) {
    fn(data, path, result, key);
  }
}

function type(obj) {
  return Array.isArray(obj) ? 'array' : typeof obj;
}

function seekSingle(data, pathStr, result, key) {
  const pathType = pathStr.split('||');
  const type = pathType[pathType.length - 1];
  const seek = [];
  pathType.map((path, pos) => {
    // if not last element in array
    if (pos !== pathType.length - 1) {
      const content = jp.query(data, path);
      content.map((v) => {
        if (v !== null) seek.push(v);
      });
    }
  });
  seek.map((v) => {
    result[key] = cast(type, v);
  });
}

function seekObject(data, pathObj, result, key) {
  if (typeof key !== 'undefined') {
    result = result[key] = {};
  }

  Object.keys(pathObj).forEach(function (name) {
    walk(data, pathObj[name], result, name);
  });
}

function cast(type, valueExtracted) {
  let value;
  switch (type) {
    case 'hexa':
      try {
        if (!(valueExtracted.length > 5 && valueExtracted.length < 8)) break;
        valueExtracted = parseInt(valueExtracted, 16);
        if (!isNaN(valueExtracted)) value = valueExtracted;
      } catch (e) {
        null;
      }
      break;
    case 'date':
    case 'month':
    case 'dateFr':
      try {
        value = moment(valueExtracted);
        if (!value.isValid()) {
          value = null;
          break;
        }
        switch (type) {
          case 'date':
            value = moment(valueExtracted).format('YYYY-MM-DD');
            break;
          case 'month':
            value = moment(valueExtracted, 'DD MM YYYY').format('YYYY-MM');
            break;
          case 'dateFr':
            value = moment(valueExtracted).format('DD/MM/YYYY');
            break;
        }
      } catch (e) {
        value = null;
      }
      break;
    case 'boolean':
      try {
        value = [true, 'Y', 'yes', 'y', 'true'].includes(valueExtracted)
          ? true
          : false;
      } catch (e) {
        null;
      }
      break;
    case '0or1':
      try {
        value = [
          true,
          'Y',
          'yes',
          'y',
          'true',
          'YES',
          'yes_50percent',
          'yes_100percent',
        ].includes(valueExtracted)
          ? 1
          : ['dnk', 'Dnk', 'DNK'].includes(valueExtracted)
          ? null
          : 0;
      } catch (e) {
        null;
      }
      break;
    case 'int':
      try {
        value = parseInt(valueExtracted);
      } catch (e) {
        value = null;
      }
      break;
    case 'string':
      try {
        value = [
          'Y',
          'yes',
          'Yes',
          'y',
          'true',
          'YES',
          'N',
          'NO',
          'No',
          'no',
          'n',
          'dnk',
          'Dnk',
          'DNK',
        ].includes(valueExtracted)
          ? null
          : valueExtracted.toString();
      } catch (e) {
        value = null;
      }
      break;
    default:
      value = valueExtracted;
      break;
  }
  return value;
}
