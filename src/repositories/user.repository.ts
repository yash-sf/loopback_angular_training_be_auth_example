import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthdatasourceDataSource} from '../datasources';
import {AuthUser, AuthUserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
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
