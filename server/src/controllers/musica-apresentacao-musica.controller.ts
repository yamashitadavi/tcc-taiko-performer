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
  Musica,
} from '../models';
import {MusicaApresentacaoRepository} from '../repositories';

export class MusicaApresentacaoMusicaController {
  constructor(
    @repository(MusicaApresentacaoRepository)
    public musicaApresentacaoRepository: MusicaApresentacaoRepository,
  ) { }

  @get('/musica-apresentacaos/{id}/musica', {
    responses: {
      '200': {
        description: 'Musica belonging to MusicaApresentacao',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Musica),
          },
        },
      },
    },
  })
  async getMusica(
    @param.path.number('id') id: typeof MusicaApresentacao.prototype.id,
  ): Promise<Musica> {
    return this.musicaApresentacaoRepository.musica(id);
  }
}
