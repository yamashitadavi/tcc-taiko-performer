import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {Tocador, TocadorRelations} from '../models';

export class TocadorRepository extends DefaultCrudRepository<
  Tocador,
  typeof Tocador.prototype.id,
  TocadorRelations
> {
  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource,
  ) {
    super(Tocador, dataSource);
  }
}
