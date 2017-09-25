import fs from 'fs';
import lodash from 'lodash';
import { promisify } from 'util';
import { EventEmitter } from 'events';

const readDirAsync = promisify(fs.readdir);

/**
 * @class DirWatcher
 * This class responsible for watching files in directory
 * and send events to Importer class about any changing file
 * @author Mikita Isakau
 */
export default class DirWatcher {
  constructor() {
    this.emitter = new EventEmitter();
    this.pathsCache = [];
  }

  /**
   * Watching the files for a specific directory
   * @param {string} path - The specific path to the folder
   * @param {number} delay (default value is 1s) - The interval between updates of the observer
   */
  watch(path, delay = 1000) {
    if (!path) {
      console.log('The path is not specified!');
      return;
    }
    if (this.pathsCache.includes(path)) {
      console.log(`The path ${path} already watching!`);
      return;
    }
    readDirAsync(path)
      .then((files) => {
        lodash.forEach(files, (item) => {
          const FILE = `${path}/${item}`;
          fs.watchFile(FILE, { interval: delay }, () => {
            console.log(`The file ${FILE} has been changed!`);
            this.emitter.emit('dir-watcher:changed', { file: FILE });
          });
          this.emitter.emit('dir-watcher:register', { file: FILE });
        });
      });
    this.pathsCache.push(path);
    console.log(`The path ${path} is watching!`);
  }

  /**
   * Turn off watching the files for a specific directory
   * @param {string} path - The specific path to the folder
   */
  unwatch(path) {
    if (!path) {
      console.log('The path isn\'t specified!');
      return;
    }
    if (!this.pathsCache.includes(path)) {
      console.log(`The path ${path} isn't watching!`);
      return;
    }

    readDirAsync(path)
      .then((files) => {
        lodash.forEach(files, (item) => {
          const FILE = `${path}/${item}`;
          fs.unwatchFile(FILE);
          this.emitter.emit('dir-watcher:unregister', { file: FILE });
        });
      });
    this.pathsCache.filter(item => (item !== path));
    console.log(`The watching for ${path} has been stopped!`);
  }
}
