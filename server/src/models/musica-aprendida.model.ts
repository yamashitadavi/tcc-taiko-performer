import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Tocador} from './tocador.model';
import {Musica} from './musica.model';
import {InstrumentoMusica} from './instrumento-musica.model';

//@model({settings: {strict: true}})
/*
{
  settings: {
    foreignKeys: {
      fk_idTocador_musicaAprendida: {
        name: 'fk_idTocador_musicaAprendida',
        entity: 'Tocador',
        entityKey: 'id',
        foreignKey: 'idTocador',
      },
      fk_idMusica_musicaAprendida: {
        name: 'fk_idMusica_musicaAprendida',
        entity: 'Musica',
        entityKey: 'id',
        foreignKey: 'idMusica',
      },
      fk_idInstrumentoMusica_musicaAprendida: {
        name: 'fk_idInstrumentoMusica_musicaAprendida',
        entity: 'InstrumentoMusica',
        entityKey: 'id',
        foreignKey: 'idInstrumentoMusica',
      }
    }
  }
}
  @belongsTo(() => Tocador)
  idTocador: number;

  @belongsTo(() => InstrumentoMusica)
  idInstrumentoMusica: number;

*/
@model()
export class MusicaAprendida extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Tocador)
  tocadorId: number;

  @belongsTo(() => Musica)
  musicaId: number;

  @belongsTo(() => InstrumentoMusica)
  instrumentoMusicaId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MusicaAprendida>) {
    super(data);
  }
}

export interface MusicaAprendidaRelations {
  // describe navigational properties here

}

export type MusicaAprendidaWithRelations = MusicaAprendida & MusicaAprendidaRelations;
