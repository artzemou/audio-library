const Typesense = require('typesense')
const {typesense: {
  TYPESENSE_HOST,
  TYPE_SENSE_PORT,
  TYPE_SENSE_PROTOCOL,
  TYPE_SENSE_API_KEY
}} = require('../config')

const client = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST, // For Typesense Cloud use xxx.a1.typesense.net
      port: TYPE_SENSE_PORT, // For Typesense Cloud use 443
      protocol: TYPE_SENSE_PROTOCOL, // For Typesense Cloud use https
    },
  ],
  apiKey: TYPE_SENSE_API_KEY,
  connectionTimeoutSeconds: 5,
})

module.exports = client
