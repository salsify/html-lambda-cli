'use strict';

const fs = require('fs-extra');
const path = require('path');
const q = require('q');
const sass = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const child = require('child_process');
const AWS = require('aws-sdk');
const zipFolder = require('zip-folder');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const paths = require('../paths');
const logger = require('../logger');

const buildName = 'build-' + Math.floor(Date.now() / 1000) + '.zip';

function makeFolder(folder) {
  if (!fs.existsSync(folder)) {
    logger.info('Created', 'new folder ' + folder);
    return fs.mkdir(folder);
  } 
}

function copy(file, dest) {
  logger.info('Copying', file);

  return fs.copy(file, path.join(dest, path.basename(file)), {clobber: true});
}

function installPackages() {
  let exec = q.denodeify(child.exec);

  return exec('npm install --production --prefix tmp', { cwd: process.cwd() }).then((error, stdout, stderr) => {
    logger.step('Finished npm install');
  });
} 

let collectSource = async (() => {
  await (makeFolder('tmp'));
  await (makeFolder('config'));

  await (copy('index.html', 'tmp'));
  await (copy('index.js', 'tmp'));
  await (copy('inject.js', 'tmp'));
  await (copy('package.json', 'tmp'));

  await (copy('config/aws-config.json', 'tmp/config'));

  logger.step('Finished collecting source');
});

function processSASS() {
  let rawSASS = fs.readFileSync(paths.project('style.scss')).toString();

  let processed = sass.renderSync({
    file: 'style.scss'
  });

  logger.info('Performed', 'SCSS -> CSS');

  return postcss([ autoprefixer ]).process(processed.css.toString()).then((result) => {
    logger.info('Performed', 'css autoprefixing');

    result.warnings().forEach((warn) => {
      logger.warning(warn.toString());
    });

    fs.writeFileSync(paths.project('tmp/style.css'), result.css);
    logger.step('Finished processing SASS');
  });
}

function encryptConfig(awsConfig) {
  let config = fs.readFileSync('config/config.json').toString();
  let kms = new AWS.KMS({region: awsConfig.lambdaRegion});

  let params = {
    KeyId: awsConfig.lambdaKmsArn,
    Plaintext: config
  };

  let encrypt = q.denodeify(kms.encrypt.bind(kms));

  return encrypt(params).then((data) => {
    fs.writeFileSync(paths.project('tmp/config/config.json.enc'), data.CiphertextBlob);

    logger.step('Finished encrypting config.json');
  });

}

let buildZip = async (() => {
  await (makeFolder('dist'));

  let zip = q.denodeify(zipFolder);

  return zip('tmp', path.join('dist', buildName)).then(() => {
    logger.step('Finished building zip file ' + buildName);
  });
});

let partialBuild = async (() => {
  await (collectSource());
  await (installPackages());
  await (processSASS());

  return buildName;
});

let fullBuild = async (() => {
  const awsConfig = require(paths.project('config/aws-config'));

  await (partialBuild());
  await (encryptConfig(awsConfig));
  await (buildZip());

  return buildName;
});

module.exports = {
  partial: partialBuild,
  full: fullBuild
}