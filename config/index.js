const dotenv = require('dotenv')
dotenv.config()
module.exports = {
  PORT: process.env.PORT || 3008,
  CIPHERS_KEY: process.env.CIPHERS_KEY,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  typesense: {
    TYPESENSE_HOST: '6th0wq8xzlkc5p1ip-1.a1.typesense.net',
    TYPE_SENSE_PORT: 443,
    TYPE_SENSE_PROTOCOL: 'https',
    TYPE_SENSE_API_KEY: 'mU5lOkumeIcnqglFOOV8nhhU2W2wqjj5'
  }
}
