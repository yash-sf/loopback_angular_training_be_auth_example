import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'authcachedatasource',
  connector: 'redis',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DATABASE,
  url: process.env.REDIS_URL,
};

console.log(config);

export class RedisDataSource extends juggler.DataSource {
  static dataSourceName = 'redis';

  constructor(
    @inject('datasources.config.redis', {optional: true})
    dsConfig: object = {...config},
  ) {
    // Override data source config from environment variables
    Object.assign(dsConfig, {});
    super(dsConfig);
  }
}
