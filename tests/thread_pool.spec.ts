import {ThreadPool} from '../src'
import {SimpleWorker} from './simple_worker'
import {ThreadSimpleWorker} from './thread_simple_worker'

type ready_task = {
  v: any,
  success?: string,
  fail?: string
}

describe('Thread pool', ()=>{
  test('Creates many thread. Some ok, some fail.', (done)=>{
    const pool = new ThreadPool(4, SimpleWorker);
    const number_of_tasks = 30;
    const ready: ready_task[] = [];
    const success = "ok";
    const fail = "fail";
    for(let i =0; i< number_of_tasks; i++){
      pool.run(i).then((v)=>{
        ready.push({
          v,
          success
        });
        task_ended();
      }).catch((v)=>{
        ready.push({
          v,
          fail
        });
        task_ended();
      });
    }

    function task_ended(){
      if(number_of_tasks == ready.length){
        console.log(ready);
        done();
      }
    }
  });

  test('Create many thread in Worker threads', (done) => {
    const pool = new ThreadPool(4, ThreadSimpleWorker);
    const number_of_tasks = 30;
    const ready: ready_task[] = [];
    const success = "ok";
    const fail = "fail";
    for(let i =0; i< number_of_tasks; i++){
      pool.run(i).then((v)=>{
        ready.push({
          v,
          success
        });
        task_ended();
      }).catch((v)=>{
        ready.push({
          v,
          fail
        });
        task_ended();
      });
    }

    function task_ended(){
      if(number_of_tasks == ready.length){
        console.log(ready);
        pool.stop();
        done();
      }
    }
  })
});
