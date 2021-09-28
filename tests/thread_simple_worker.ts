import {ThreadWorker} from '../src'
import path from 'path'

export class ThreadSimpleWorker extends ThreadWorker {
  constructor(){
    super(path.join(__dirname, 'thread_js_worker.js'));
  };
}
