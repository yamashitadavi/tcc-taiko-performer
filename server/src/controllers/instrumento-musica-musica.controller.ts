import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  InstrumentoMusica,
  Musica,
} from '../models';
import {InstrumentoMusicaRepository} from '../repositories';

export class InstrumentoMusicaMusicaController {
  constructor(
    @repository(InstrumentoMusicaRepository)
    public instrumentoMusicaRepository: InstrumentoMusicaRepository,
  ) { }

  @get('/instrumento-musicas/{id}/musica', {
    responses: {
      '200': {
        description: 'Musica belonging to InstrumentoMusica',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Musica),
          },
        },
      },
    },
  })
  async getMusica(
    @param.path.number('id') id: typeof InstrumentoMusica.prototype.id,
  ): Promise<Musica> {
    return this.instrumentoMusicaRepository.musica(id);
  }
}
