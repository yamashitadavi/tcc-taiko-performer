import {Entity, model, property} from '@loopback/repository';

@model()
export class Instrumento extends Entity {
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

  //imagem?: Buffer;

  @property({
    type: 'string',
  })
  tipoImagem?: string;

  @property({
    type: 'number',
  })
  tamanhoX?: number;

  @property({
    type: 'number',
  })
  tamanhoY?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Instrumento>) {
    super(data);
  }
}

export interface InstrumentoRelations {
  // describe navigational properties here
}

export type InstrumentoWithRelations = Instrumento & InstrumentoRelations;
