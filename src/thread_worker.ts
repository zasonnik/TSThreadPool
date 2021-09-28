import {PoolWorker} from './worker'
import { Worker } from 'worker_threads';


export abstract class ThreadWorker extends PoolWorker {
  private worker: Worker;
  constructor(private readonly worker_file_path: string){
    super();
    this.worker = new Worker(worker_file_path);
  }

  free(){
    this.worker.terminate();
  }

  run(data: any): Promise<any>{
    return new Promise((resolve, reject)=> {
      const worker = this.worker;
      worker.postMessage(data);
      worker.once('message', (res: any) => {
        removeExtraCalls();
        resolve(res);
      });
      worker.once('error', (e: any) => {
        removeExtraCalls();
        reject(e);
      });
      worker.once('exit', (code: any)=> {
        removeExtraCalls();
        reject(new Error(`Thread failed with code ${code}`));
        //May be we need to restore worker
        if(code!=0){
          this.worker = new Worker(this.worker_file_path);
        }
      });
      function removeExtraCalls(){
        worker.removeAllListeners('message');
        worker.removeAllListeners('error');
        worker.removeAllListeners('exit');
      }
    });

  };

}
