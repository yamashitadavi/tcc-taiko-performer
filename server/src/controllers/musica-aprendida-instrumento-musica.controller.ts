import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MusicaAprendida,
  InstrumentoMusica,
} from '../models';
import {MusicaAprendidaRepository} from '../repositories';

export class MusicaAprendidaInstrumentoMusicaController {
  constructor(
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository: MusicaAprendidaRepository,
  ) { }

  @get('/musica-aprendidas/{id}/instrumento-musica', {
    responses: {
      '200': {
        description: 'InstrumentoMusica belonging to MusicaAprendida',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstrumentoMusica),
          },
        },
      },
    },
  })
  async getInstrumentoMusica(
    @param.path.number('id') id: typeof MusicaAprendida.prototype.id,
  ): Promise<InstrumentoMusica> {
    return this.musicaAprendidaRepository.instrumentoMusica(id);
  }
}
