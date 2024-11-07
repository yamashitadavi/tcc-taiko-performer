import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MusicaApresentacao,
  Apresentacao,
} from '../models';
import {MusicaApresentacaoRepository} from '../repositories';

export class MusicaApresentacaoApresentacaoController {
  constructor(
    @repository(MusicaApresentacaoRepository)
    public musicaApresentacaoRepository: MusicaApresentacaoRepository,
  ) { }

  @get('/musica-apresentacaos/{id}/apresentacao', {
    responses: {
      '200': {
        description: 'Apresentacao belonging to MusicaApresentacao',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Apresentacao),
          },
        },
      },
    },
  })
  async getApresentacao(
    @param.path.number('id') id: typeof MusicaApresentacao.prototype.id,
  ): Promise<Apresentacao> {
    return this.musicaApresentacaoRepository.apresentacao(id);
  }
}
