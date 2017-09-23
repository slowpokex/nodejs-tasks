'use strict'
import fs from 'fs';
import parse from 'csv-parse';
import lodash from 'lodash';
import { promisify } from 'util';
import { EventEmitter } from 'events';

const readFileAsync = promisify(fs.readFile);
const asyncParser = promisify(parse);
const asyncWriteFile = promisify(fs.writeFile);

export default class Importer {
    
    /** 
     * Handler for dir-watcher:changed event
     * @param file : changed file, which came from event 
     */
    loader(event) {
        readFileAsync(event.file)
            .then((rawData) => asyncParser(rawData, { columns: true }))
            .then((data) => {
                lodash.pullAllWith(this.data, data, lodash.isEqual);            
                this.data = lodash.unionWith(this.data, data, lodash.isEqual);
            })
            .catch((err) => console.error('Error in csv file parsing...'));
    }

    constructor(emitter) {
        if (!emitter || !(emitter instanceof Importer)) {
            throw new Error(`Emitter didn't register in DirWatcher`);
        }
        this.data = [];        
        this.emitter = emitter;
        this.emitter.on('dir-watcher:changed', this.loader.bind(this))
    }   

    /**
     * 
     * @param {*} path 
     */
    import(path) {
        return asyncWriteFile(path, JSON.stringify(this.data));
    }
    
    
    /**
     * 
     * @param {*} path 
     */
    importSync(path) {
        return fs.writeFileSync(path, this.data);
    }

    /**
     * 
     */
    clear() {
        this.emitter.removeListener('dir-watcher:changed', this.handler);
    }
}