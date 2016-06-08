'use strict';

const fs = require('fs');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const express = require('express');
const render = require('html-lambda-runner').render;

const build = require('./build');
const paths = require('../paths');
const logger = require('../logger');

module.exports = async (() => {
  let app = new express();

  await (build.partial());

  app.get('/', (req, res) => {
    logger.info('Processed', 'GET for lambda');
    res.send(render(null, req.query, paths.project('tmp')));
  });

  fs.watch(paths.project(), {encoding: 'buffer'}, (event, filename) => {
    logger.info('File Changes', 'rebuilding sources...');
    build.partial();
  });

  app.listen(3000, () => {
    logger.info('Listening', 'on localhost:3000');
  });
});