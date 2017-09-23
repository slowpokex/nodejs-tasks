import fs from 'fs';
import lodash from 'lodash';
import { promisify } from 'util';
import { EventEmitter } from 'events';

const readDirAsync = promisify(fs.readdir);

export default class DirWatcher {
    constructor(emitter) {
        if (!emitter || !(emitter instanceof EventEmitter)) {
            throw new Error(`Emitter didn't register in DirWatcher`);
        }
        this.emitter = emitter;
        this.pathsCache = [];
    }

    /**
     * Watching the files for a specific directory
     * @param {string} path - The specific path to the folder 
     * @param {number} delay - The interval between updates of the observer
     */
    watch(path, delay = 1000) {
        if (!path) {
            console.log(`The path not specified!`);
            return;
        }
        if (this.pathsCache.includes(path)) {
            console.log(`The path ${path} already watching!`);
            return;
        }
        readDirAsync(path)
            .then((files) => {
                lodash.forEach(files, (item) => {
                    const FILE = path + '/' + item;
                    fs.watchFile(FILE, 
                        { interval: delay }, 
                        () => {
                            console.log(`The file ${FILE} has been changed!`);
                            this.emitter.emit('dir-watcher:changed', { file: FILE });
                        });
                })
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
            console.log(`The path not specified!`);
            return;
        }
        if (!this.pathsCache.includes(path)) {
            console.log(`The path ${path} not watching!`);
            return;
        }

        readDirAsync(path)
            .then((files) => {
                lodash.forEach(files, (item) => {
                    const FILE = path + '/' + item;
                    fs.unwatchFile(FILE);
                });
            });
        this.pathsCache.filter((item) => (item !== path));
        console.log(`The watching of ${path} has been stopped!`);
    }
}
 