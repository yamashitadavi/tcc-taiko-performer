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
  Tocador,
} from '../models';
import {TocadorMusicaRepository} from '../repositories';

export class TocadorMusicaTocadorController {
  constructor(
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository: TocadorMusicaRepository,
  ) { }

  @get('/tocador-musicas/{id}/tocador', {
    responses: {
      '200': {
        description: 'Tocador belonging to TocadorMusica',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tocador),
          },
        },
      },
    },
  })
  async getTocador(
    @param.path.number('id') id: typeof TocadorMusica.prototype.id,
  ): Promise<Tocador> {
    return this.tocadorMusicaRepository.tocador(id);
  }
}
