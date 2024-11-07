import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {Musica, MusicaRelations} from '../models';

export class MusicaRepository extends DefaultCrudRepository<
  Musica,
  typeof Musica.prototype.id,
  MusicaRelations
> {
  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource,
  ) {
    super(Musica, dataSource);
  }
}
