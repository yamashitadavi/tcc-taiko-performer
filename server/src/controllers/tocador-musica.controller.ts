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
import {TocadorMusica} from '../models';
import {TocadorMusicaRepository} from '../repositories';

export class TocadorMusicaController {
  constructor(
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository : TocadorMusicaRepository,
  ) {}

  @post('/tocador-musica')
  @response(200, {
    description: 'TocadorMusica model instance',
    content: {'application/json': {schema: getModelSchemaRef(TocadorMusica)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TocadorMusica, {
            title: 'NewTocadorMusica',

          }),
        },
      },
    })
    tocadorMusica: TocadorMusica,
  ): Promise<TocadorMusica> {
    return this.tocadorMusicaRepository.create(tocadorMusica);
  }

  @get('/tocador-musica/count')
  @response(200, {
    description: 'TocadorMusica model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TocadorMusica) where?: Where<TocadorMusica>,
  ): Promise<Count> {
    return this.tocadorMusicaRepository.count(where);
  }

  @get('/tocador-musica')
  @response(200, {
    description: 'Array of TocadorMusica model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TocadorMusica, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TocadorMusica) filter?: Filter<TocadorMusica>,
  ): Promise<TocadorMusica[]> {
    return this.tocadorMusicaRepository.find(filter);
  }

  @patch('/tocador-musica')
  @response(200, {
    description: 'TocadorMusica PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TocadorMusica, {partial: true}),
        },
      },
    })
    tocadorMusica: TocadorMusica,
    @param.where(TocadorMusica) where?: Where<TocadorMusica>,
  ): Promise<Count> {
    return this.tocadorMusicaRepository.updateAll(tocadorMusica, where);
  }

  @get('/tocador-musica/{id}')
  @response(200, {
    description: 'TocadorMusica model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TocadorMusica, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TocadorMusica, {exclude: 'where'}) filter?: FilterExcludingWhere<TocadorMusica>
  ): Promise<TocadorMusica> {
    return this.tocadorMusicaRepository.findById(id, filter);
  }

  @patch('/tocador-musica/{id}')
  @response(200, {
    description: 'TocadorMusica PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TocadorMusica, {partial: true}),
        },
      },
    })
    tocadorMusica: TocadorMusica,
  ): Promise<TocadorMusica> {
    await this.tocadorMusicaRepository.updateById(id, tocadorMusica);
    return tocadorMusica
  }

  @put('/tocador-musica/{id}')
  @response(204, {
    description: 'TocadorMusica PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tocadorMusica: TocadorMusica,
  ): Promise<void> {
    await this.tocadorMusicaRepository.replaceById(id, tocadorMusica);
  }

  @del('/tocador-musica/{id}')
  @response(204, {
    description: 'TocadorMusica DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tocadorMusicaRepository.deleteById(id);
  }
}
