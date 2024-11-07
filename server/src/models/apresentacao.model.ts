import {Entity, model, property} from '@loopback/repository';

@model()
export class Apresentacao extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  nome: string;

  @property({
    type: 'date',
    required: true,
  })
  dataHora: string;

  @property({
    type: 'string',
    required: true,
  })
  local: string;

  @property({
    type: 'string',
  })
  observacoes?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Apresentacao>) {
    super(data);
  }
}

export interface ApresentacaoRelations {
  // describe navigational properties here
}

export type ApresentacaoWithRelations = Apresentacao & ApresentacaoRelations;
