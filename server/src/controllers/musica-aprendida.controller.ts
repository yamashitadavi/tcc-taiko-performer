import {
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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {MusicaAprendida} from '../models';
import {MusicaAprendidaRepository} from '../repositories';

export class MusicaAprendidaController {
  constructor(
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository : MusicaAprendidaRepository,
  ) {}

  @post('/musica-aprendida')
  @response(200, {
    description: 'MusicaAprendida model instance',
    content: {'application/json': {schema: getModelSchemaRef(MusicaAprendida)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MusicaAprendida, {
            title: 'NewMusicaAprendida',

          }),
        },
      },
    })
    musicaAprendida: MusicaAprendida,
  ): Promise<MusicaAprendida> {
    return this.musicaAprendidaRepository.create(musicaAprendida);
  }

  @get('/musica-aprendida/count')
  @response(200, {
    description: 'MusicaAprendida model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MusicaAprendida) where?: Where<MusicaAprendida>,
  ): Promise<Count> {
    return this.musicaAprendidaRepository.count(where);
  }

  @get('/musica-aprendida')
  @response(200, {
    description: 'Array of MusicaAprendida model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MusicaAprendida, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MusicaAprendida) filter?: Filter<MusicaAprendida>,
  ): Promise<MusicaAprendida[]> {
    return this.musicaAprendidaRepository.find(filter);
  }

  @patch('/musica-aprendida')
  @response(200, {
    description: 'MusicaAprendida PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MusicaAprendida, {partial: true}),
        },
      },
    })
    musicaAprendida: MusicaAprendida,
    @param.where(MusicaAprendida) where?: Where<MusicaAprendida>,
  ): Promise<Count> {
    return this.musicaAprendidaRepository.updateAll(musicaAprendida, where);
  }

  @get('/musica-aprendida/{id}')
  @response(200, {
    description: 'MusicaAprendida model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MusicaAprendida, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MusicaAprendida, {exclude: 'where'}) filter?: FilterExcludingWhere<MusicaAprendida>
  ): Promise<MusicaAprendida> {
    return this.musicaAprendidaRepository.findById(id, filter);
  }

  @patch('/musica-aprendida/{id}')
  @response(204, {
    description: 'MusicaAprendida PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MusicaAprendida, {partial: true}),
        },
      },
    })
    musicaAprendida: MusicaAprendida,
  ): Promise<void> {
    await this.musicaAprendidaRepository.updateById(id, musicaAprendida);
  }

  @put('/musica-aprendida/{id}')
  @response(204, {
    description: 'MusicaAprendida PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() musicaAprendida: MusicaAprendida,
  ): Promise<void> {
    await this.musicaAprendidaRepository.replaceById(id, musicaAprendida);
  }

  @del('/musica-aprendida/{id}')
  @response(204, {
    description: 'MusicaAprendida DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.musicaAprendidaRepository.deleteById(id);
  }
}
