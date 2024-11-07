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
import {Musica} from '../models';
import {InstrumentoMusicaRepository, MusicaAprendidaRepository, MusicaApresentacaoRepository, MusicaRepository} from '../repositories';

//delete musicaAprendida
//delete musicaApresentacao
//delete instrumentoMusica
export class MusicaController {
  constructor(
    @repository(MusicaRepository)
    public musicaRepository : MusicaRepository,
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository :MusicaAprendidaRepository,
    @repository(MusicaApresentacaoRepository)
    public musicaApresentacaoRepository : MusicaApresentacaoRepository,
    @repository(InstrumentoMusicaRepository)
    public instrumentoMusicaRepository : InstrumentoMusicaRepository,
  ) {}

  @post('/musicas')
  @response(200, {
    description: 'Musica model instance',
    content: {'application/json': {schema: getModelSchemaRef(Musica)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Musica, {
            title: 'NewMusica',

          }),
        },
      },
    })
    musica: Musica,
  ): Promise<Musica> {
    return this.musicaRepository.create(musica);
  }

  @get('/musicas/count')
  @response(200, {
    description: 'Musica model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Musica) where?: Where<Musica>,
  ): Promise<Count> {
    return this.musicaRepository.count(where);
  }

  @get('/musicas')
  @response(200, {
    description: 'Array of Musica model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Musica, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Musica) filter?: Filter<Musica>,
  ): Promise<Musica[]> {
    return this.musicaRepository.find(filter);
  }

  @patch('/musicas')
  @response(200, {
    description: 'Musica PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Musica, {partial: true}),
        },
      },
    })
    musica: Musica,
    @param.where(Musica) where?: Where<Musica>,
  ): Promise<Count> {
    return this.musicaRepository.updateAll(musica, where);
  }

  @get('/musicas/{id}')
  @response(200, {
    description: 'Musica model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Musica, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Musica, {exclude: 'where'}) filter?: FilterExcludingWhere<Musica>
  ): Promise<Musica> {
    return this.musicaRepository.findById(id, filter);
  }

  @patch('/musicas/{id}')
  @response(204, {
    description: 'Musica PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Musica, {partial: true}),
        },
      },
    })
    musica: Musica,
  ): Promise<void> {
    await this.musicaRepository.updateById(id, musica);
  }

  @put('/musicas/{id}')
  @response(204, {
    description: 'Musica PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() musica: Musica,
  ): Promise<void> {
    await this.musicaRepository.replaceById(id, musica);
  }

  @del('/musicas/{id}')
  @response(204, {
    description: 'Musica DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.musicaApresentacaoRepository.deleteAll({musicaId: id})
    await this.musicaAprendidaRepository.deleteAll({musicaId: id})
    await this.instrumentoMusicaRepository.deleteAll({musicaId: id})

    await this.musicaRepository.deleteById(id);
  }
}
