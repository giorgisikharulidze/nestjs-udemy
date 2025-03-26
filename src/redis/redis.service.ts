import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';


@Injectable()
export class RedisService {
  private client: Redis;

  constructor(

  ) {
    this.client = new Redis({
      host: process.env.REDIS_HOST, // ან თქვენი Redis სერვერის ჰოსტი
      port: parseInt(process.env.REDIS_PORT ?? '6378'), // ან თქვენი Redis სერვერის პორტი
    });
  }
  
  public async getClient(): Promise<Redis> {
    return this.client;
  }

  public async get<T>(key: string): Promise<T | null> {
    const result = await this.client.get(key);
    if (!result) {
      return null;
    }
    return JSON.parse(result);
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<string> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      return this.client.setex(key, ttl, stringValue);
    }
    return this.client.set(key, stringValue);
  }
/*  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }
*/

public async mget<T>(keys: string[]): Promise<T[] | null> {
    const result = await this.client.mget(keys);
    if (!result.length) {
      return [];
    }
    return result.filter((x) => x !== null).map((item) => JSON.parse(item));
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  public async deleteKeysByPattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(`${pattern}*`);

    if (keys.length === 0) {
      return 0;
    }
    return this.client.del(keys);
  }

  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  public async flushAll(): Promise<void> {
    await this.client.flushall();
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.client.expire(key, ttl);
    return result === 1;
  }

  public async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  public async hset<T>(
    hashKey: string,
    field: string,
    value: T
  ): Promise<number> {
    const stringValue = JSON.stringify(value);
    return this.client.hset(hashKey, field, stringValue);
  }

  public async hget<T>(hashKey: string, field: string): Promise<T | null> {
    const result = await this.client.hget(hashKey, field);
    if (!result) {
      return null;
    }
    return JSON.parse(result);
  }

  public async hgetFields<T>(
    hashKey: string,
    fields: Array<keyof T>
  ): Promise<Record<keyof T, T[keyof T] | null>> {
    const stringFields = fields.map((field) => field as unknown as string);

    const results = await this.client.hmget(hashKey, ...stringFields);

    const response: Record<keyof T, T[keyof T] | null> = {} as Record<
      keyof T,
      T[keyof T] | null
    >;

    fields.forEach((field, index) => {
      const result = results[index];
      response[field] = result ? JSON.parse(result) : null;
    });

    return response;
  }

  public async smembers<T>(key: string): Promise<T[]> {
    const result = await this.client.smembers(key);
    if (!result) {
      return [];
    }
    return result.map((item) => JSON.parse(item));
  }

}
