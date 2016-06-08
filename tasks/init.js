'use strict';

const fs = require('fs-extra');
const path = require('path');

const paths = require('../paths');
const resources = paths.lib('resources');

const logger = require('../logger');
const timer = require('../timer');

module.exports = () => {
  let clock = timer.start();

  logger.info('Generating', 'index.html');
  initFile('index.html');

  logger.info('Generating', 'index.js');
  initFile('index.js');

  logger.info('Generating', 'templateData.js');
  initFile('templateData.js');

  logger.info('Generating', 'style.scss');
  initFile('style.scss');

  logger.info('Generating', 'package.json');
  initFile('package.json');

  logger.info('Generating', 'config/config.json');
  initFile('config/config.json');

  logger.info('Generating', 'config/aws-config.json');
  initFile('config/aws-config.json');

  logger.done('Done in ' + timer.stop(clock));
}

function initFile(file) {
  fs.copySync(path.join(resources, file), file);
}