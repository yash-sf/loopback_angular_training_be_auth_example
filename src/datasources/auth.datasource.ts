import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'authdatasource',
  connector: 'postgresql',
  url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost/${process.env.DB_DATABASE}`,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthdatasourceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'authdatasource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.authdatasource', {optional: true})
    dsConfig: object = config,
  ) {
    console.log(dsConfig);
    super(dsConfig);
  }
}
