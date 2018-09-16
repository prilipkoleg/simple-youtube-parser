'use strict';

const path = require('path');
const nconf = require('nconf');
const Joi = require('joi');
const packageJsonFile = require('../package');
require('dotenv').config();

nconf.argv().env();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(3000),
  API_KEY: Joi.string().required(),
  CHANNELS_FILE: Joi.string().default('channels.csv'),
  CHANNELS_FILE_DELIMITER: Joi.string().default(';'),
  DEBUG: Joi.string().default(''),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(nconf.get(), envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  app: {
    name: packageJsonFile.name,
    version: packageJsonFile.version,
  },
  apiKey: envVars.API_KEY,
  channelsFile: envVars.CHANNELS_FILE,
  channelsFileDelimiter: envVars.CHANNELS_FILE_DELIMITER,
  debug: envVars.DEBUG,
};

console.log('======================== Config ========================');
console.log(config);
console.log('========================================================');

module.exports = config;