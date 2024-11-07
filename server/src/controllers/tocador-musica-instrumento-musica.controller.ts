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
  InstrumentoMusica,
} from '../models';
import {TocadorMusicaRepository} from '../repositories';

export class TocadorMusicaInstrumentoMusicaController {
  constructor(
    @repository(TocadorMusicaRepository)
    public tocadorMusicaRepository: TocadorMusicaRepository,
  ) { }

  @get('/tocador-musicas/{id}/instrumento-musica', {
    responses: {
      '200': {
        description: 'InstrumentoMusica belonging to TocadorMusica',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstrumentoMusica),
          },
        },
      },
    },
  })
  async getInstrumentoMusica(
    @param.path.number('id') id: typeof TocadorMusica.prototype.id,
  ): Promise<InstrumentoMusica> {
    return this.tocadorMusicaRepository.instrumentoMusica(id);
  }
}
