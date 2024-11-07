import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {Instrumento, InstrumentoRelations} from '../models';

export class InstrumentoRepository extends DefaultCrudRepository<
  Instrumento,
  typeof Instrumento.prototype.id,
  InstrumentoRelations
> {
  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource,
  ) {
    super(Instrumento, dataSource);
  }
}
