import fs, { createReadStream, createWriteStream, readdir } from 'fs';
import { promisify } from 'util';
import { O_APPEND, O_CREAT } from 'constants';

import minimist from 'minimist';
import request from 'request';
import through from 'through2';
import lodash from 'lodash';
import split from 'split2';

const readdirAsync = promisify(readdir);

const getExtension = file =>
  file.slice((Math.max(0, file.lastIndexOf('.')) || Infinity) + 1);
const getFileName = file => file.slice(0, file.lastIndexOf('.'));

const parseCSV = () => {
  let templateKeys = [];
  let parseHeadline = true;

  return through.obj((data, enc, cb) => {
    if (parseHeadline) {
      templateKeys = data.toString().split(',');
      parseHeadline = false;
      return cb(null, null);
    }

    const entries = data.toString().split(',');
    const obj = {};
    templateKeys.forEach((el, index) => {
      obj[el] = entries[index];
    });

    return cb(null, obj);
  });
};

const toJSON = () => {
  const obj = [];
  return through.obj(function (data, enc, cb) {
    obj.push(data);
    cb(null, null);
  }, function (cb) {
    this.push(JSON.stringify(obj));
    cb();
  });
};

const toUpperCase = () => through((chunk, enc, cb) =>
  cb(null, lodash.toUpper(chunk.toString())));

const inputOutput = file => createReadStream(file)
  .pipe(process.stdout);

const printHelpMessage = (err) => {
  console.error(err.message);
  return createReadStream(`${__dirname}/helpMessage.txt`)
    .pipe(process.stderr);
};

function upperCaseOutput() {
  return process.stdin
    .pipe(toUpperCase())
    .pipe(process.stdout);
}

function transformFromFile(filename, intoFile) {
  if (getExtension(filename) !== 'csv') {
    throw new Error(`File ${filename} isn't csv-file`);
  }

  const writeStream = intoFile ?
    createWriteStream(`${getFileName(filename)}.json`) : process.stdout;

  return createReadStream(filename)
    .pipe(split())
    .pipe(parseCSV())
    .pipe(toJSON())
    .pipe(writeStream);
}

function cssBundler(path) {
  const bundlePath = `${path}/bundle.css`;
  const getWriter = () => createWriteStream(bundlePath, { flags: O_APPEND });

  const handleCss = css => new Promise((res, rej) => {
    const cssReader = createReadStream(css);
    cssReader.pipe(getWriter());

    cssReader.on('end', res);
    cssReader.on('error', rej);
  });

  fs.openSync(bundlePath, O_CREAT);

  const addCssStream =
    request('https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css');

  readdirAsync(path)
    .then((files) => {
      const promises = files
        .filter(file => getExtension(file) === 'css')
        .map(css => `${path}/${css}`)
        .map(handleCss);

      return Promise.all(promises);
    }).then(() => {
      addCssStream.pipe(getWriter());
    }).catch(err => printHelpMessage(err));
}

function handleCommandLine(argv) {
  if (argv.help || argv.h) {
    return printHelpMessage();
  }

  const action = argv.action || argv.a;
  const filename = argv.file || argv.f;
  const path = argv.path || argv.p;

  try {
    switch (action) {
      case 'io-upper':
        return upperCaseOutput();
      case 'file-io':
        return inputOutput(filename);
      case 'csv2json-io':
        return transformFromFile(filename, false);
      case 'csv2json-file':
        return transformFromFile(filename, true);
      case 'css-bundler':
        return cssBundler(path);
      default:
        throw new Error(action);
    }
  } catch (e) {
    return printHelpMessage(e);
  }
}

// Main logic of streams-util
handleCommandLine(minimist(process.argv.slice(2)));
