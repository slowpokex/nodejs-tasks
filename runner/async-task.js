'use strict'
import { EventEmitter } from 'events';
import { DirWatcher, Importer } from '../data-import'

const fileEmitter = new EventEmitter();
const dirWatcher = new DirWatcher(fileEmitter);
const importer = new Importer(fileEmitter);

dirWatcher.watch('./data');
dirWatcher.watch('./data');
dirWatcher.unwatch('./lol');
dirWatcher.unwatch('./data');

// setInterval(() => {
//     importer.import('./file.txt')
//         .then(() => {
//             console.log('Done!');
//         });
// }, 5000)