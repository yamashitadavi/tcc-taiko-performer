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
  Tocador,
} from '../models';
import {MusicaAprendidaRepository} from '../repositories';

export class MusicaAprendidaTocadorController {
  constructor(
    @repository(MusicaAprendidaRepository)
    public musicaAprendidaRepository: MusicaAprendidaRepository,
  ) { }

  @get('/musica-aprendidas/{id}/tocador', {
    responses: {
      '200': {
        description: 'Tocador belonging to MusicaAprendida',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tocador),
          },
        },
      },
    },
  })
  async getTocador(
    @param.path.number('id') id: typeof MusicaAprendida.prototype.id,
  ): Promise<Tocador> {
    return this.musicaAprendidaRepository.tocador(id);
  }
}
