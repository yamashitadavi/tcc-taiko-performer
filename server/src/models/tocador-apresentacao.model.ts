import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tocador} from './tocador.model';
import {Apresentacao} from './apresentacao.model';

//@model({settings: {strict: true}})
/*
{
  settings: {
    foreignKeys: {
      fk_idApresentacao_tocadorApresentacao: {
        name: 'fk_idApresentacao_tocadorApresentacao',
        entity: 'Apresentacao',
        entityKey: 'id',
        foreignKey: 'idApresentacao',
      },
      fk_idTocador_tocadorApresentacao: {
        name: 'fk_idTocador_tocadorApresentacao',
        entity: 'Tocador',
        entityKey: 'id',
        foreignKey: 'idTocador',
      }
    },
  }
}
  @belongsTo(() => Tocador)
  idTocador: number;

  @belongsTo(() => Apresentacao)
  idApresentacao: number;
*/
@model()
export class TocadorApresentacao extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Tocador)
  tocadorId: number;

  @belongsTo(() => Apresentacao)
  apresentacaoId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TocadorApresentacao>) {
    super(data);
  }
}

export interface TocadorApresentacaoRelations {
  // describe navigational properties here
}

export type TocadorApresentacaoWithRelations = TocadorApresentacao & TocadorApresentacaoRelations;
