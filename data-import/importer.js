import fs from 'fs';
import parse from 'csv-parse';
import { promisify } from 'util';
import { EventEmitter } from 'events';

const readFileAsync = promisify(fs.readFile);
const asyncParser = promisify(parse);
// const asyncWriteFile = promisify(fs.writeFile);

/**
 * @class Importer
 * This class responsible for handling event, which came from
 * DirWatcher class
 * @author Mikita Isakau
 */
export default class Importer {
  /** 
   * Load from csv-file
   * @param {string} file : path to file
   * @return {Promise} : the data from csv-file, wrapped by Promise
   */
  static load(file) {
    return readFileAsync(file)
      .then(rawData => asyncParser(rawData, { columns: true }));
  }

  /** 
   * Handler for dir-watcher:register event
   * @param event : file, which came from event, which will be added to map
   */
  register(event) {
    const { file } = event;
    Importer.load(file)
      .then((data) => {
        this.dataMap.set(file, data);
      });
  }

  /** 
   * Handler for dir-watcher:changed event
   * @param event : changed file, which came from event 
   */
  change(event) {
    const { file } = event;
    if (!this.dataMap.has(file)) {
      throw new Error(`The file ${file} not contains in Importer`);
    }
    Importer.load(file)
      .then((data) => {
        this.dataMap.set(file, data);
      });
  }

  /** 
   * Handler for dir-watcher:unregister event
   * @param event : file, which came from event, which will be deleted from map
   */
  unregister(event) {
    this.dataMap.delete(event.file);
  }

  constructor(emitter) {
    if (!emitter || !(emitter instanceof EventEmitter)) {
      throw new Error('Emitter didn\'t register in Importer');
    }
    this.emitter = emitter;
    this.dataMap = new Map();

    this.register = this.register.bind(this);
    this.change = this.change.bind(this);
    this.unregister = this.unregister.bind(this);

    this.emitter.on('dir-watcher:register', this.register);
    this.emitter.on('dir-watcher:changed', this.change);
    this.emitter.on('dir-watcher:unregister', this.unregister);
  }

  // TODO: need for testing
  // show() {
  //   const map = this.dataMap.entries();
  //   for (const [key, value] of map) {
  //     console.log(`${key} : length is ${value.length}`);
  //   }
  // }

  /**
   * Asyncronous getting imported data
   * @param {string} path - path for file
   * @return {Promise} with imported data 
   */
  import(path) {
    return Promise.resolve(this.dataMap.get(path));
  }

  /**
   * Syncronous getting imported data
   * @param {string} path - path for file
   * @return {Object} with imported data 
   */
  importSync(path) {
    // if (!path || this.dataMap.has(path)) {
    //   console.error(`${path} : Wrong file name or file not found!`);
    // }
    return this.dataMap.get(path);
  }

  /**
   * Clear all listeners from EventEmitter, which came from constructor
   */
  clear() {
    this.emitter.removeListener('dir-watcher:register', this.register);
    this.emitter.removeListener('dir-watcher:changed', this.change);
    this.emitter.removeListener('dir-watcher:unregister', this.unregister);
    console.log('The Importer object has been cleaned!');
  }
}
