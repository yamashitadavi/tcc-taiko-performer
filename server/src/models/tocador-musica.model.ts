import {belongsTo, Entity, model, property} from '@loopback/repository';
import {MusicaApresentacao} from './musica-apresentacao.model';
import {Tocador} from './tocador.model';
import {InstrumentoMusica} from './instrumento-musica.model';

/*
{
  settings: {
    foreignKeys: {
      fk_idApresentacao_tocadorMusica: {
        name: 'fk_idApresentacao_tocadorMusica',
        entity: 'Apresentacao',
        entityKey: 'id',
        foreignKey: 'idApresentacao',
      },
      fk_idTocador_tocadorMusica: {
        name: 'fk_idTocador_tocadorMusica',
        entity: 'Tocador',
        entityKey: 'id',
        foreignKey: 'idTocador',
      },
      fk_idMusicaApre_tocadorMusica: {
        name: 'fk_idMusicaApre_tocadorMusica',
        entity: 'MusicaApresentacao',
        entityKey: 'id',
        foreignKey: 'idMusicaApre',
      },
    }
  }
}
  @belongsTo(() => Apresentacao)
  idApresentacao: number;

  @belongsTo(() => MusicaApresentacao)
  idMusicaApre: number;

  @belongsTo(() => Tocador)
  idTocador: number;
*/
@model()
export class TocadorMusica extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => MusicaApresentacao)
  musicaApresentacaoId: number;

  @belongsTo(() => Tocador)
  tocadorId: number;

  @belongsTo(() => InstrumentoMusica)
  instrumentoMusicaId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TocadorMusica>) {
    super(data);
  }
}

export interface TocadorMusicaRelations {
  // describe navigational properties here
}

export type TocadorMusicaWithRelations = TocadorMusica & TocadorMusicaRelations;
