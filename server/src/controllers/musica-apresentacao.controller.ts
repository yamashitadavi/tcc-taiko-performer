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
import {MusicaApresentacao} from '../models';
import {MusicaApresentacaoRepository, TocadorMusicaRepository} from '../repositories';

export class MusicaApresentacaoController {
  constructor(
    @repository(MusicaApresentacaoRepository)
    public musicaApresentacaoRepository : MusicaApresentacaoRepository,
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository : TocadorMusicaRepository,
  ) {}

  @post('/musica-apresentacao')
  @response(200, {
    description: 'MusicaApresentacao model instance',
    content: {'application/json': {schema: getModelSchemaRef(MusicaApresentacao)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MusicaApresentacao, {
            title: 'NewMusicaApresentacao',

          }),
        },
      },
    })
    musicaApresentacao: MusicaApresentacao,
  ): Promise<MusicaApresentacao> {
    return this.musicaApresentacaoRepository.create(musicaApresentacao);
  }

  @get('/musica-apresentacao/count')
  @response(200, {
    description: 'MusicaApresentacao model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MusicaApresentacao) where?: Where<MusicaApresentacao>,
  ): Promise<Count> {
    return this.musicaApresentacaoRepository.count(where);
  }

  @get('/musica-apresentacao')
  @response(200, {
    description: 'Array of MusicaApresentacao model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MusicaApresentacao, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MusicaApresentacao) filter?: Filter<MusicaApresentacao>,
  ): Promise<MusicaApresentacao[]> {
    return this.musicaApresentacaoRepository.find(filter);
  }

  @patch('/musica-apresentacao')
  @response(200, {
    description: 'MusicaApresentacao PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MusicaApresentacao, {partial: true}),
        },
      },
    })
    musicaApresentacao: MusicaApresentacao,
    @param.where(MusicaApresentacao) where?: Where<MusicaApresentacao>,
  ): Promise<Count> {
    return this.musicaApresentacaoRepository.updateAll(musicaApresentacao, where);
  }

  @get('/musica-apresentacao/{id}')
  @response(200, {
    description: 'MusicaApresentacao model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MusicaApresentacao, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MusicaApresentacao, {exclude: 'where'}) filter?: FilterExcludingWhere<MusicaApresentacao>
  ): Promise<MusicaApresentacao> {
    return this.musicaApresentacaoRepository.findById(id, filter);
  }

  @patch('/musica-apresentacao/{id}')
  @response(200, {
    description: 'MusicaApresentacao PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MusicaApresentacao, {partial: true}),
        },
      },
    })
    musicaApresentacao: MusicaApresentacao,
  ): Promise<MusicaApresentacao> {
    await this.musicaApresentacaoRepository.updateById(id, musicaApresentacao);
    return musicaApresentacao
  }

  @put('/musica-apresentacao/{id}')
  @response(204, {
    description: 'MusicaApresentacao PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() musicaApresentacao: MusicaApresentacao,
  ): Promise<void> {
    await this.musicaApresentacaoRepository.replaceById(id, musicaApresentacao);
  }

  @del('/musica-apresentacao/{id}')
  @response(204, {
    description: 'MusicaApresentacao DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tocadorMusicaRepository.deleteAll({ musicaApresentacaoId: id });
    await this.musicaApresentacaoRepository.deleteById(id);
  }
}
