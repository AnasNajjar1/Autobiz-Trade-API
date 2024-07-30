const jwt = require('jsonwebtoken');
const phpSerializer = require('php-serialize');

const secretKey = process.env.autobizApiKey.replace('\\', '');
const data = {
  userId: 10235,
  country: 'FR',
  rules: 'adminCarcheck',
};
const token = jwt.sign(
  {
    data: phpSerializer.serialize(data),
  },
  secretKey,
  { algorithm: 'HS256', expiresIn: '1h' },
);

exports.token = token;
