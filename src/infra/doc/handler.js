const path = require('path');
const StaticFileHandler = require('serverless-aws-static-file-handler');
const clientFilesPath = path.join(__dirname, './');
const fileHandler = new StaticFileHandler(clientFilesPath);

module.exports.html = async (event, context) => {
  event.path = 'index.html';

  return fileHandler.get(event, context);
};
