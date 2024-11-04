import { createClient } from 'redis';

export const redis = createClient({
  url: `redis://${process.env.QUEUE_HOSTAME}:6379`
});

redis.on('ready', (err) => {
  console.log(`Connecting to redis...`);
});

redis.on('error', (err) => {
  console.log(`Redis error ${JSON.stringify(err)}`)
});

redis.connect();