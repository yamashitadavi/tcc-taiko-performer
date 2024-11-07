import {Entity, model, property} from '@loopback/repository';

@model()
export class Musica extends Entity {
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
    type: 'number',
    required: true,
  })
  tempo: number;

  @property({
    type: 'number',
    required: true,
  })
  layoutX: number;

  @property({
    type: 'number',
    required: true,
  })
  layoutY: number;

  @property({
    type: 'number',
    required: true,
  })
  espaco: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Musica>) {
    super(data);
  }
}

export interface MusicaRelations {
  // describe navigational properties here
}

export type MusicaWithRelations = Musica & MusicaRelations;
