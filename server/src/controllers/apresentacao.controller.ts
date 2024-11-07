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
import {Apresentacao} from '../models';
import {ApresentacaoRepository, MusicaApresentacaoRepository, TocadorApresentacaoRepository, TocadorMusicaRepository} from '../repositories';
//delete tocadorApresentacao
//delete musicaApresentacao

export class ApresentacaoController {
  constructor(
    @repository(ApresentacaoRepository)
    public apresentacaoRepository : ApresentacaoRepository,
    @repository(TocadorApresentacaoRepository)
    public tocadorApresentacaoRepository : TocadorApresentacaoRepository,
    @repository(MusicaApresentacaoRepository)
    public musicaApresentacaoRepository : MusicaApresentacaoRepository,
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository : TocadorMusicaRepository,
  ) {}

  @post('/apresentacoes')
  @response(200, {
    description: 'Apresentacao model instance',
    content: {'application/json': {schema: getModelSchemaRef(Apresentacao)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Apresentacao, {
            title: 'NewApresentacao',

          }),
        },
      },
    })
    apresentacao: Apresentacao,
  ): Promise<Apresentacao> {
    return this.apresentacaoRepository.create(apresentacao);
  }

  @get('/apresentacoes/count')
  @response(200, {
    description: 'Apresentacao model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Apresentacao) where?: Where<Apresentacao>,
  ): Promise<Count> {
    return this.apresentacaoRepository.count(where);
  }

  @get('/apresentacoes')
  @response(200, {
    description: 'Array of Apresentacao model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Apresentacao, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Apresentacao) filter?: Filter<Apresentacao>,
  ): Promise<Apresentacao[]> {
    return this.apresentacaoRepository.find(filter);
  }

  @patch('/apresentacoes')
  @response(200, {
    description: 'Apresentacao PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Apresentacao, {partial: true}),
        },
      },
    })
    apresentacao: Apresentacao,
    @param.where(Apresentacao) where?: Where<Apresentacao>,
  ): Promise<Count> {
    return this.apresentacaoRepository.updateAll(apresentacao, where);
  }

  @get('/apresentacoes/{id}')
  @response(200, {
    description: 'Apresentacao model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Apresentacao, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Apresentacao, {exclude: 'where'}) filter?: FilterExcludingWhere<Apresentacao>
  ): Promise<Apresentacao> {
    return this.apresentacaoRepository.findById(id, filter);
  }

  @patch('/apresentacoes/{id}')
  @response(204, {
    description: 'Apresentacao PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Apresentacao, {partial: true}),
        },
      },
    })
    apresentacao: Apresentacao,
  ): Promise<Apresentacao> {
    await this.apresentacaoRepository.updateById(id, apresentacao);
    return apresentacao;
  }

  @put('/apresentacoes/{id}')
  @response(204, {
    description: 'Apresentacao PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() apresentacao: Apresentacao,
  ): Promise<void> {
    await this.apresentacaoRepository.replaceById(id, apresentacao);
  }

  @del('/apresentacoes/{id}')
  @response(204, {
    description: 'Apresentacao DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    //delete tocadorApresentacao
    //delete musicaApresentacao

    await this.tocadorApresentacaoRepository.deleteAll({apresentacaoId: id});
    await this.tocadorMusicaRepository.deleteAll({musicaApresentacaoId: { inq: (await this.musicaApresentacaoRepository.find({where: {apresentacaoId: id}})).map(e=>e.id)}});
    await this.musicaApresentacaoRepository.deleteAll({apresentacaoId: id});
    await this.apresentacaoRepository.deleteById(id);
  }
}
