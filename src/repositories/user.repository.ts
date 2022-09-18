import {inject} from '@loopback/core';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {AuthdatasourceDataSource} from '../datasources';
import {AuthUser, AuthUserRelations} from '../models';

export class UserRepository extends SoftCrudRepository<
  AuthUser,
  typeof AuthUser.prototype.id,
  AuthUserRelations
> {
  constructor(
    @inject('datasources.authdatasource') dataSource: AuthdatasourceDataSource,
  ) {
    super(AuthUser, dataSource);
  }
}
