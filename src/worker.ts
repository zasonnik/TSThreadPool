export abstract class PoolWorker {
  abstract run(data: any): Promise<any>;
  abstract free(): void;
}
