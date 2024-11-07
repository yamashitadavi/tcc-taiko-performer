import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TocadorApresentacao,
  Apresentacao,
} from '../models';
import {TocadorApresentacaoRepository} from '../repositories';

export class TocadorApresentacaoApresentacaoController {
  constructor(
    @repository(TocadorApresentacaoRepository)
    public tocadorApresentacaoRepository: TocadorApresentacaoRepository,
  ) { }

  @get('/tocador-apresentacaos/{id}/apresentacao', {
    responses: {
      '200': {
        description: 'Apresentacao belonging to TocadorApresentacao',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Apresentacao),
          },
        },
      },
    },
  })
  async getApresentacao(
    @param.path.number('id') id: typeof TocadorApresentacao.prototype.id,
  ): Promise<Apresentacao> {
    return this.tocadorApresentacaoRepository.apresentacao(id);
  }
}
