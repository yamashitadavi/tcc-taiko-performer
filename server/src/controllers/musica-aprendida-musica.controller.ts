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
  Musica,
} from '../models';
import {MusicaAprendidaRepository} from '../repositories';

export class MusicaAprendidaMusicaController {
  constructor(
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository: MusicaAprendidaRepository,
  ) { }

  @get('/musica-aprendidas/{id}/musica', {
    responses: {
      '200': {
        description: 'Musica belonging to MusicaAprendida',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Musica),
          },
        },
      },
    },
  })
  async getMusica(
    @param.path.number('id') id: typeof MusicaAprendida.prototype.id,
  ): Promise<Musica> {
    return this.musicaAprendidaRepository.musica(id);
  }
}
