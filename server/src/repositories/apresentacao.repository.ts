import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {Apresentacao, ApresentacaoRelations} from '../models';

export class ApresentacaoRepository extends DefaultCrudRepository<
  Apresentacao,
  typeof Apresentacao.prototype.id,
  ApresentacaoRelations
> {
  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource,
  ) {
    super(Apresentacao, dataSource);
  }
}
