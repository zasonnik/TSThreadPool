const {
  isMainThread, parentPort
} = require('worker_threads');

if(isMainThread){
  throw new Error('Run as main not supported');
}

parentPort.on("message", (data) => {
  if(typeof data !== "number"){
    return parentPort.postMessage({});
  }
  setTimeout(()=> {
    const ok = data % 3;
    if(!ok){
      throw data;
    }
    parentPort.postMessage(data);
  }, 100 + (data % 2)*100);
});
