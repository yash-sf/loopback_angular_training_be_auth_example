import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import {AuthUser} from '../models';
import {UserRepository} from '../repositories';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as any;
      if (!user) throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
      const authUser: AuthUser = await this.userRepository.findById(
        user.userId,
      );
      if (!authUser)
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      return user;
    };
  }
}
