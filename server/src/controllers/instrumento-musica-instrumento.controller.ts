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
  Instrumento,
} from '../models';
import {InstrumentoMusicaRepository} from '../repositories';

export class InstrumentoMusicaInstrumentoController {
  constructor(
    @repository(InstrumentoMusicaRepository)
    public instrumentoMusicaRepository: InstrumentoMusicaRepository,
  ) { }

  @get('/instrumento-musicas/{id}/instrumento', {
    responses: {
      '200': {
        description: 'Instrumento belonging to InstrumentoMusica',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Instrumento),
          },
        },
      },
    },
  })
  async getInstrumento(
    @param.path.number('id') id: typeof InstrumentoMusica.prototype.id,
  ): Promise<Instrumento> {
    return this.instrumentoMusicaRepository.instrumento(id);
  }
}
