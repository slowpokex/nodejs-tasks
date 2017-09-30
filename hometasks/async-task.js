import { EventEmitter } from 'events';
import { DirWatcher, Importer } from '../data-import';

const dirWatcher = new DirWatcher();
const importer = new Importer(dirWatcher);

const FILE = './data/MOCK_DATA.csv';

const WATCH_INTERVAL = 5000;
const IMPORT_INTERVAL = 2500;
const WATCH_LIMIT = 60000;

dirWatcher.watch('./data', WATCH_INTERVAL);

const importingSync = () => {
  try {
    const data = importer.importSync('./data/MOCK_DATA.csv');
    console.log(`Sync load import:  ${data.length} values in file`);
  } catch (error) {
    console.error(`Has been error when reading file - ${error}`);
  }
};

const interval = setInterval(() => {
  // Sync work
  importingSync();

  // Async work
  importer.import(FILE)
    .then((data) => {
      console.log(`Async load import:  ${data.length} values in file`);
    }).catch((err) => {
      console.error(`Has been error when reading file - ${err}`);
    });
}, IMPORT_INTERVAL);

setTimeout(() => {
  clearInterval(interval);
  dirWatcher.unwatch('./data');
}, WATCH_LIMIT);
