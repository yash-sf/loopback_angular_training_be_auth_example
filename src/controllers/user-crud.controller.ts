import {
  AnyType,
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {authenticate, AuthErrorKeys, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {AuthUser} from '../models';
import {UserRepository} from '../repositories';

export class UserCrudController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['CreateUser']})
  @post('/users')
  @response(200, {
    description: 'AuthUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(AuthUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthUser, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<AuthUser, 'id'>,
  ): Promise<AuthUser> {
    // password should be hashed here
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'AuthUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(AuthUser) where?: Where<AuthUser>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @post('/login')
  @response(200, {
    description: 'Auth token',
    content: {'application/json': {schema: AnyType}},
  })
  async getToken(
    @requestBody() user: {username: string; password: string},
  ): Promise<{token: string}> {
    // password should be hashed and checked against the hashed one in db
    const authUser = await this.userRepository.findOne({
      where: {
        username: user.username,
        password: user.password,
      },
    });
    if (!authUser)
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);

    const payload = {
      userId: authUser?.id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 3600,
      issuer: process.env.JWT_ISSUER,
      algorithm: 'HS256',
    });
    return {token};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['ListUsers']})
  @get('/users')
  @response(200, {
    description: 'Array of AuthUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AuthUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AuthUser) filter?: Filter<AuthUser>,
  ): Promise<AuthUser[]> {
    return this.userRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['UpdateUsers']})
  @patch('/users')
  @response(200, {
    description: 'AuthUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthUser, {partial: true}),
        },
      },
    })
    user: AuthUser,
    @param.where(AuthUser) where?: Where<AuthUser>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['GetUser']})
  @get('/users/{id}')
  @response(200, {
    description: 'AuthUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AuthUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AuthUser, {exclude: 'where'})
    filter?: FilterExcludingWhere<AuthUser>,
  ): Promise<AuthUser> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @patch('/users/{id}')
  @response(204, {
    description: 'AuthUser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthUser, {partial: true}),
        },
      },
    })
    user: AuthUser,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @authenticate(STRATEGY.BEARER)
  @put('/users/{id}')
  @response(204, {
    description: 'AuthUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: AuthUser,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @authenticate(STRATEGY.BEARER)
  @del('/users/{id}')
  @response(204, {
    description: 'AuthUser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
