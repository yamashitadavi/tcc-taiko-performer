import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Apresentacao} from './apresentacao.model';
import {Musica} from './musica.model';

/*
{
  settings: {
    foreignKeys: {
      fk_idApresentacao_musicaApresentacao: {
        name: 'fk_idApresentacao_musicaApresentacao',
        entity: 'Apresentacao',
        entityKey: 'id',
        foreignKey: 'idApresentacao',
      },
      fk_idMusica_musicaApresentacao: {
        name: 'fk_idMusica_musicaApresentacao',
        entity: 'Musica',
        entityKey: 'id',
        foreignKey: 'idMusica',
      },
    },
  }
}

*/
@model()
export class MusicaApresentacao extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  ordem: number;

  @belongsTo(() => Apresentacao)
  apresentacaoId: number;

  @belongsTo(() => Musica)
  musicaId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MusicaApresentacao>) {
    super(data);
  }
}

export interface MusicaApresentacaoRelations {
  // describe navigational properties here
}

export type MusicaApresentacaoWithRelations = MusicaApresentacao & MusicaApresentacaoRelations;
