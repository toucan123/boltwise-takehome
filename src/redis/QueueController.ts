import { createClient } from 'redis';

const client = createClient({
  url: `redis://${process.env.QUEUE_HOSTAME}:6379`
});

client.on('ready', (err) => {
  console.log(`Connecting to redis...`);
});

client.on('error', (err) => {
  console.log(`Redis error ${JSON.stringify(err)}`)
});

client.connect();

type Constructor<T> = new (...args: any[]) => T;

type QueueControllerParams<T> = {
  name: string,
  processor: (item: T) => void,
  ItemConstructor: Constructor<T>
};

const LOCK_TIMEOUT_MILLS = 2000;

export class QueueController <T> {
  readonly name: string;
  readonly lockName: string;
  readonly processor: (item: T) => void;
  readonly ItemConstructor: Constructor<T>;

  constructor(params: QueueControllerParams<T>) {
    this.name = params.name;
    this.lockName = `${params.name}:lock`;
    this.processor = params.processor;
    this.ItemConstructor = params.ItemConstructor;
  }

  private async acquireLock(): Promise<boolean> {
    const result = await client.set(
      this.lockName, 
      "1", 
      {
        NX: true,
        PX: LOCK_TIMEOUT_MILLS
      }
    );
    return result === "OK";
  }
  
  private async releaseLock(): Promise<void> {
    await client.del(this.lockName);
  }
 
  private async process(){
    const hasLock = await this.acquireLock();
    if (!hasLock) {
      return;
    }
    try {
      const data = await client.rPop(this.name);
      if (data) {
        console.log(`Processing ${data}`);
        const item = new this.ItemConstructor(JSON.parse(data));
        await this.processor(item);
      }
    } finally {
      await this.releaseLock();
    }
  }

  async enqueue(item: T) {
    await client.lPush(this.name, JSON.stringify(item));
  }

  async run() {
    while(true) {
      await this.process();
    }
  }
}