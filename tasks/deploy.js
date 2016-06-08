'use strict';

const fs = require('fs-extra');
const q = require('q');
const AWS = require('aws-sdk');
const path = require('path');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const paths = require('../paths');
const logger = require('../logger');

module.exports = async ((buildName) => {
  const awsConfig = require(paths.project('config/aws-config'));

  AWS.config.region = awsConfig.lambdaRegion;
  let lambda = new AWS.Lambda();

  logger.info('Preparing', 'to deploy ' + awsConfig.lambdaName);

  let getFunction = q.denodeify(lambda.getFunction.bind(lambda));
  let updateFunctionCode = q.denodeify(lambda.updateFunctionCode.bind(lambda));

  let params = {
    FunctionName: awsConfig.lambdaName,
    ZipFile: fs.readFileSync(paths.project(path.join('dist', buildName)))
  };

  let checkLambda = (params) => {
    return getFunction({FunctionName: params.FunctionName}).then((result) => {
      if (result.statusCode == 404) {
        logger.error('Failed to find specified lambda');
        logger.error(result);
      }
    })
  };

  let uploadLambda = (params) => {
    return updateFunctionCode(params).then((result, data) => {
      if (result.statusCode) {
        logger.error('Failed to upload Lambda');
        logger.error(result);

        return;
      }

      logger.step('Finished deploying to Amazon');
    })
  };

  await (checkLambda(params));
  await (uploadLambda(params));
});