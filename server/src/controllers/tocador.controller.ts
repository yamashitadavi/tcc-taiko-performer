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
import {Tocador} from '../models';
import {MusicaAprendidaRepository, TocadorApresentacaoRepository, TocadorMusicaRepository, TocadorRepository} from '../repositories';
    //delete tocadorApresentacao
    //delete tocadorMusica
    //delete musicaAprendida
    export class TocadorController {
  constructor(
    @repository(TocadorRepository)
    public tocadorRepository : TocadorRepository,
    @repository(TocadorApresentacaoRepository)
    public tocadorApresentacaoRepository : TocadorApresentacaoRepository,
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository : TocadorMusicaRepository,
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository : MusicaAprendidaRepository,
  ) {}

  @post('/tocadores')
  @response(200, {
    description: 'Tocador model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tocador)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tocador, {
            title: 'NewTocador',

          }),
        },
      },
    })
    tocador: Tocador,
  ): Promise<Tocador> {
    return this.tocadorRepository.create(tocador);
  }

  @get('/tocadores/count')
  @response(200, {
    description: 'Tocador model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tocador) where?: Where<Tocador>,
  ): Promise<Count> {
    return this.tocadorRepository.count(where);
  }

  @get('/tocadores')
  @response(200, {
    description: 'Array of Tocador model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tocador, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tocador) filter?: Filter<Tocador>,
  ): Promise<Tocador[]> {
    return this.tocadorRepository.find(filter);
  }

  @patch('/tocadores')
  @response(200, {
    description: 'Tocador PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tocador, {partial: true}),
        },
      },
    })
    tocador: Tocador,
    @param.where(Tocador) where?: Where<Tocador>,
  ): Promise<Count> {
    return this.tocadorRepository.updateAll(tocador, where);
  }

  @get('/tocadores/{id}')
  @response(200, {
    description: 'Tocador model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tocador, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Tocador, {exclude: 'where'}) filter?: FilterExcludingWhere<Tocador>
  ): Promise<Tocador> {
    return this.tocadorRepository.findById(id, filter);
  }

  @patch('/tocadores/{id}')
  @response(204, {
    description: 'Tocador PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tocador, {partial: true}),
        },
      },
    })
    tocador: Tocador,
  ): Promise<void> {
    await this.tocadorRepository.updateById(id, tocador);
  }

  @put('/tocadores/{id}')
  @response(204, {
    description: 'Tocador PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tocador: Tocador,
  ): Promise<void> {
    await this.tocadorRepository.replaceById(id, tocador);
  }

  @del('/tocadores/{id}')
  @response(204, {
    description: 'Tocador DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    //delete tocadorApresentacao
    //delete tocadorMusica
    //delete musicaAprendida

    await this.tocadorApresentacaoRepository.deleteAll({tocadorId: id})
    await this.tocadorMusicaRepository.deleteAll({tocadorId: id})
    await this.musicaAprendidaRepository.deleteAll({tocadorId: id})

    await this.tocadorRepository.deleteById(id);
  }
}
