const updatedDiff = require('deep-object-diff').updatedDiff;

function writeLog(type, table, data, logModel) {
  switch (type) {
    case 'C':
      writeLogCreate(table, data, logModel);
      break;
    case 'U':
      writeLogUpdate(table, data, logModel);
      break;
    case 'D':
      writeLogDelete(table, data, logModel);
      break;

    default:
      break;
  }
}

function writeLogDelete(table, data, logModel) {
  logModel.create({
    action: 'D',
    user: data.deletedBy,
    referenceTable: table,
    referenceId: data.id,
    data: null,
  });
}

function writeLogCreate(table, data, logModel) {
  logModel.create({
    action: 'C',
    user: data.createdBy,
    referenceTable: table,
    referenceId: data.id,
    data: JSON.stringify(data),
  });
}

function writeLogUpdate(table, data, logModel) {
  const { _previousDataValues, dataValues } = data;
  const user = dataValues.updatedBy;
  delete _previousDataValues.updatedAt;
  delete _previousDataValues.updatedBy;
  delete _previousDataValues.deletedAt;
  delete _previousDataValues.deletedBy;
  delete dataValues.updatedAt;
  delete dataValues.updatedBy;
  delete dataValues.deletedAt;
  delete dataValues.deletedBy;

  const diff = updatedDiff(_previousDataValues, dataValues);
  if (Object.keys(diff).length > 0 && diff.constructor === Object) {
    logModel.create({
      action: 'U',
      user,
      referenceTable: table,
      referenceId: data.id,
      data: JSON.stringify(diff),
    });
  }
}

exports.writeLog = writeLog;
