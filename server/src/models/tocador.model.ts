import {Entity, model, property} from '@loopback/repository';

@model()
export class Tocador extends Entity {
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
    required: true
  })
  dataEntrada: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Tocador>) {
    super(data);
  }
}

export interface TocadorRelations {
  // describe navigational properties here
}

export type TocadorWithRelations = Tocador & TocadorRelations;
