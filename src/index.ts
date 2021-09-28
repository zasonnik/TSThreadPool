import {PoolWorker} from './worker'

type PoolElement = {
  worker: PoolWorker,
  free: boolean
}
type PoolAwaiting = {
  resolve: (result: any) => void,
  reject: (error: any) => void,
  payload: any
}

class ThreadPool<T extends PoolWorker> {
  private pool: PoolElement[];
  private awaiting: PoolAwaiting[];
  private createWorker: ()=>T;
  constructor(public readonly size: number, w: new() => T){
    this.pool = [];
    this.awaiting = [];
    this.createWorker = () => new w; //Sory for this. Typescript generics makes me cry :'(
  }
  run(payload: unknown): Promise<any> {
    let poolElement = this.pool.find(w => w.free);
    if(!poolElement && this.pool.length < this.size){
      poolElement = {
        worker: this.createWorker(),
        free: true
      }
      this.pool.push(poolElement);
    }
    if(poolElement){
      const workerPollElement = poolElement; //Prevent change out of promise
      workerPollElement.free = false;
      return this.runWorkAtPoolElement(workerPollElement, payload);
    }
    return new Promise((resolve, reject) => {
      this.awaiting.push({
        resolve,
        reject,
        payload
      });
    });
  }
  private runWorkAtPoolElement(element: PoolElement, payload: any){
    element.free=false;
    console.log(`Run work "${payload}" at element ${this.pool.indexOf(element)}`)
    return new Promise((resolve, reject)=> {
      element.worker.run(payload).then((work_res: any) => {
        this.poolElementEndedWork(element);
        resolve(work_res);
      }).catch((e: any)=> {
        this.poolElementEndedWork(element);
        reject(e);
      });
    });
  }
  private poolElementEndedWork(e: PoolElement){
    if(this.awaiting.length > 0){
      const waiter = this.awaiting.splice(0,1)[0]; //FIFO
      this.runWorkAtPoolElement(e, waiter.payload)
        .then(waiter.resolve)
        .catch(waiter.reject);
    } else {
      e.free = true;
    }
  }
}

export {
  ThreadPool,
  PoolWorker
}