import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TocadorMusica,
  MusicaApresentacao,
} from '../models';
import {TocadorMusicaRepository} from '../repositories';

export class TocadorMusicaMusicaApresentacaoController {
  constructor(
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository: TocadorMusicaRepository,
  ) { }

  @get('/tocador-musicas/{id}/musica-apresentacao', {
    responses: {
      '200': {
        description: 'MusicaApresentacao belonging to TocadorMusica',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MusicaApresentacao),
          },
        },
      },
    },
  })
  async getMusicaApresentacao(
    @param.path.number('id') id: typeof TocadorMusica.prototype.id,
  ): Promise<MusicaApresentacao> {
    return this.tocadorMusicaRepository.musicaApresentacao(id);
  }
}
