import {PoolWorker} from '../src';

export class SimpleWorker extends PoolWorker {
  run(data: any){
    return new Promise((resolve, reject) => {
      if(typeof data !== "number"){
        return resolve({});
      }
      setTimeout(()=> {
        const f = data % 3 ? resolve : reject;
        f(data);
      }, 100 + (data % 2)*100);
    });
  }

  free(){
    //Trivial
  }
}
