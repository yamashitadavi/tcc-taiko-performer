import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Instrumento} from './instrumento.model';
import {Musica} from './musica.model';

/*
{
  settings: {
    foreignKeys: {
      fk_idInstrumento_instrumentoMusica: {
        name: 'fk_idInstrumento_instrumentoMusica',
        entity: 'Instrumento',
        entityKey: 'id',
        foreignKey: 'idInstrumento',
      },
      fk_idMusica_instrumentoMusica: {
        name: 'fk_idMusica_instrumentoMusica',
        entity: 'Musica',
        entityKey: 'id',
        foreignKey: 'idMusica',
      }
    }
  }
}
  @belongsTo(() => Instrumento)
  idInstrumento: number;

  @belongsTo(() => Musica)
  idMusica: number;

*/
@model()
export class InstrumentoMusica extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  nome?: string;

  @property({
    type: 'number',
  })
  posicaoX?: number;

  @property({
    type: 'number',
  })
  posicaoY?: number;

  @property({
    type: 'number',
  })
  tamanhoX?: number;

  @property({
    type: 'number',
  })
  tamanhoY?: number;

  @property({
    type: 'boolean',
  })
  terTocador?: boolean;

  @belongsTo(() => Instrumento)
  instrumentoId: number;

  @belongsTo(() => Musica)
  musicaId: number;

  constructor(data?: Partial<InstrumentoMusica>) {
    super(data);
  }
}

export interface InstrumentoMusicaRelations {
  // describe navigational properties here
}

export type InstrumentoMusicaWithRelations = InstrumentoMusica & InstrumentoMusicaRelations;
