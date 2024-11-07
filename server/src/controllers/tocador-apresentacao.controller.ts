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
import {TocadorApresentacao} from '../models';
import {TocadorApresentacaoRepository, TocadorMusicaRepository} from '../repositories';
//delete TocadorMusica
export class TocadorApresentacaoController {
  constructor(
    @repository(TocadorApresentacaoRepository)
    public tocadorApresentacaoRepository : TocadorApresentacaoRepository,
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository : TocadorMusicaRepository,
  ) {}

  @post('/tocador-apresentacao')
  @response(200, {
    description: 'TocadorApresentacao model instance',
    content: {'application/json': {schema: getModelSchemaRef(TocadorApresentacao)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TocadorApresentacao, {
            title: 'NewTocadorApresentacao',

          }),
        },
      },
    })
    tocadorApresentacao: TocadorApresentacao,
  ): Promise<TocadorApresentacao> {
    return this.tocadorApresentacaoRepository.create(tocadorApresentacao);
  }

  @get('/tocador-apresentacao/count')
  @response(200, {
    description: 'TocadorApresentacao model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TocadorApresentacao) where?: Where<TocadorApresentacao>,
  ): Promise<Count> {
    return this.tocadorApresentacaoRepository.count(where);
  }

  @get('/tocador-apresentacao')
  @response(200, {
    description: 'Array of TocadorApresentacao model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TocadorApresentacao, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TocadorApresentacao) filter?: Filter<TocadorApresentacao>,
  ): Promise<TocadorApresentacao[]> {
    return this.tocadorApresentacaoRepository.find(filter);
  }

  @patch('/tocador-apresentacao')
  @response(200, {
    description: 'TocadorApresentacao PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TocadorApresentacao, {partial: true}),
        },
      },
    })
    tocadorApresentacao: TocadorApresentacao,
    @param.where(TocadorApresentacao) where?: Where<TocadorApresentacao>,
  ): Promise<Count> {
    return this.tocadorApresentacaoRepository.updateAll(tocadorApresentacao, where);
  }

  @get('/tocador-apresentacao/{id}')
  @response(200, {
    description: 'TocadorApresentacao model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TocadorApresentacao, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TocadorApresentacao, {exclude: 'where'}) filter?: FilterExcludingWhere<TocadorApresentacao>
  ): Promise<TocadorApresentacao> {
    return this.tocadorApresentacaoRepository.findById(id, filter);
  }

  @patch('/tocador-apresentacao/{id}')
  @response(204, {
    description: 'TocadorApresentacao PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TocadorApresentacao, {partial: true}),
        },
      },
    })
    tocadorApresentacao: TocadorApresentacao,
  ): Promise<void> {
    await this.tocadorApresentacaoRepository.updateById(id, tocadorApresentacao);
  }

  @put('/tocador-apresentacao/{id}')
  @response(204, {
    description: 'TocadorApresentacao PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tocadorApresentacao: TocadorApresentacao,
  ): Promise<void> {
    await this.tocadorApresentacaoRepository.replaceById(id, tocadorApresentacao);
  }

  @del('/tocador-apresentacao/{id}')
  @response(204, {
    description: 'TocadorApresentacao DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const val = await this.tocadorApresentacaoRepository.findById(id, { fields: { tocadorId: true } });
    await this.tocadorMusicaRepository.deleteAll({ tocadorId: val.tocadorId, musicaApresentacao: { apresentacaoId: val.apresentacaoId } });
    await this.tocadorApresentacaoRepository.deleteById(id);
  }
}
