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
  Tocador,
} from '../models';
import {TocadorApresentacaoRepository} from '../repositories';

export class TocadorApresentacaoTocadorController {
  constructor(
    @repository(TocadorApresentacaoRepository)
    public tocadorApresentacaoRepository: TocadorApresentacaoRepository,
  ) { }

  @get('/tocador-apresentacaos/{id}/tocador', {
    responses: {
      '200': {
        description: 'Tocador belonging to TocadorApresentacao',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tocador),
          },
        },
      },
    },
  })
  async getTocador(
    @param.path.number('id') id: typeof TocadorApresentacao.prototype.id,
  ): Promise<Tocador> {
    return this.tocadorApresentacaoRepository.tocador(id);
  }
}
