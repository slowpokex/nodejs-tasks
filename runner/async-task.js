'use strict'
import { EventEmitter } from 'events';
import { DirWatcher, Importer } from '../data-import'

const fileEmitter = new EventEmitter();
const dirWatcher = new DirWatcher(fileEmitter);
const importer = new Importer(fileEmitter);

dirWatcher.watch('./data');



setTimeout(() => {
    dirWatcher.unwatch('./data');
}, 60000);