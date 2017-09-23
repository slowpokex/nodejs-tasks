'use strict'
import fs from 'fs';
import parse from 'csv-parse';
import lodash from 'lodash';
import { promisify } from 'util';
import { EventEmitter } from 'events';

const readFileAsync = promisify(fs.readFile);
const asyncParser = promisify(parse);
const asyncWriteFile = promisify(fs.writeFile);

/**
 * @author Mikita Isakau
 * @class Importer
 */
export default class Importer {    
    /** 
     * Load from csv-file
     * @param {string} file : path to file
     * @return {Promise} : the data from csv-file, wrapped by Promise
     */
    load(file) {
        return readFileAsync(file)
            .then((rawData) => asyncParser(rawData, { columns: true }));
    }

     /** 
     * Handler for dir-watcher:register event
     * @param event : file, which came from event, which will be added to map
     */
    register(event) {
        const { file } = event;
        this.load(file)
            .then((data) => {
                this.dataMap.set(file, data);
                this.show();
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
        this.load(file)
            .then((data) => {
                this.dataMap.set(file, data);
                this.show();
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
            throw new Error(`Emitter didn't register in Importer`);
        }       
        this.emitter = emitter;
        this.dataMap = new Map();

        this.register = this.register.bind(this);
        this.change = this.change.bind(this);
        this.unregister = this.unregister.bind(this);

        this.emitter.on('dir-watcher:register', this.register);
        this.emitter.on('dir-watcher:changed', this.change)        
        this.emitter.on('dir-watcher:unregister', this.unregister);
    }
    
    show() {
        for (let [key, value] of this.dataMap.entries()) {
            console.log(`${key} : length is ${value.length}`);
          }
    }

    /**
     * Asyncronous getting imported data
     * @param {string} path
     * @return {Promise} with imported data 
     */
    import(path) {
        //return asyncWriteFile(path, JSON.stringify(this.data));
    }
    
    
    /**
     * Syncronous getting imported data
     * @param {string} path
     * @return {Object} with imported data 
     */
    importSync(path) {
        //return fs.writeFileSync(path, this.data);
    }

    /**
     * Clear all listeners from EventEmitter, which came from constructor
     */
    clear() {
        this.emitter.removeListener('dir-watcher:register', this.register);
        this.emitter.removeListener('dir-watcher:changed', this.change)        
        this.emitter.removeListener('dir-watcher:unregister', this.unregister);
        console.log('The Importer object has been cleaned!');
    }
}