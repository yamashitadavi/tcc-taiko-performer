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
import {InstrumentoMusica} from '../models';
import {InstrumentoMusicaRepository, MusicaAprendidaRepository, TocadorMusicaRepository} from '../repositories';
//delete tocadorMusica
export class InstrumentoMusicaController {
  constructor(
    @repository(InstrumentoMusicaRepository)
    public instrumentoMusicaRepository : InstrumentoMusicaRepository,
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository : TocadorMusicaRepository,
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository : MusicaAprendidaRepository,
  ) {}

  @post('/instrumento-musica')
  @response(200, {
    description: 'InstrumentoMusica model instance',
    content: {'application/json': {schema: getModelSchemaRef(InstrumentoMusica)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InstrumentoMusica, {
            title: 'NewInstrumentoMusica',

          }),
        },
      },
    })
    instrumentoMusica: InstrumentoMusica,
  ): Promise<InstrumentoMusica> {
    return this.instrumentoMusicaRepository.create(instrumentoMusica);
  }

  @get('/instrumento-musica/count')
  @response(200, {
    description: 'InstrumentoMusica model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(InstrumentoMusica) where?: Where<InstrumentoMusica>,
  ): Promise<Count> {
    return this.instrumentoMusicaRepository.count(where);
  }

  @get('/instrumento-musica')
  @response(200, {
    description: 'Array of InstrumentoMusica model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(InstrumentoMusica, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(InstrumentoMusica) filter?: Filter<InstrumentoMusica>,
  ): Promise<InstrumentoMusica[]> {
    return this.instrumentoMusicaRepository.find(filter);
  }

  @patch('/instrumento-musica')
  @response(200, {
    description: 'InstrumentoMusica PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InstrumentoMusica, {partial: true}),
        },
      },
    })
    instrumentoMusica: InstrumentoMusica,
    @param.where(InstrumentoMusica) where?: Where<InstrumentoMusica>,
  ): Promise<Count> {
    return this.instrumentoMusicaRepository.updateAll(instrumentoMusica, where);
  }

  @get('/instrumento-musica/{id}')
  @response(200, {
    description: 'InstrumentoMusica model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InstrumentoMusica, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InstrumentoMusica, {exclude: 'where'}) filter?: FilterExcludingWhere<InstrumentoMusica>
  ): Promise<InstrumentoMusica> {
    return this.instrumentoMusicaRepository.findById(id, filter);
  }

  @patch('/instrumento-musica/{id}')
  @response(204, {
    description: 'InstrumentoMusica PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InstrumentoMusica, {partial: true}),
        },
      },
    })
    instrumentoMusica: InstrumentoMusica,
  ): Promise<void> {
    await this.instrumentoMusicaRepository.updateById(id, instrumentoMusica);
  }

  @put('/instrumento-musica/{id}')
  @response(204, {
    description: 'InstrumentoMusica PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() instrumentoMusica: InstrumentoMusica,
  ): Promise<void> {
    await this.instrumentoMusicaRepository.replaceById(id, instrumentoMusica);
  }

  @del('/instrumento-musica/{id}')
  @response(204, {
    description: 'InstrumentoMusica DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.musicaAprendidaRepository.deleteAll({ instrumentoMusicaId: id });
    await this.tocadorMusicaRepository.deleteAll({ instrumentoMusicaId: id });
    await this.instrumentoMusicaRepository.deleteById(id);
  }
}
