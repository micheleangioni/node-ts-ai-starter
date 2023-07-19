import {createClient, RedisClientType} from 'redis';

let redisClient: RedisClientType;

export default async () => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  });

  await redisClient.connect();

  return redisClient;
};
