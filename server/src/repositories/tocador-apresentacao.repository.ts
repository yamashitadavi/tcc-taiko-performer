import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {TocadorApresentacao, TocadorApresentacaoRelations, Tocador, Apresentacao} from '../models';
import {TocadorRepository} from './tocador.repository';
import {ApresentacaoRepository} from './apresentacao.repository';

export class TocadorApresentacaoRepository extends DefaultCrudRepository<
  TocadorApresentacao,
  typeof TocadorApresentacao.prototype.id,
  TocadorApresentacaoRelations
> {

  public readonly tocador: BelongsToAccessor<Tocador, typeof TocadorApresentacao.prototype.id>;

  public readonly apresentacao: BelongsToAccessor<Apresentacao, typeof TocadorApresentacao.prototype.id>;

  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource, @repository.getter('TocadorRepository') protected tocadorRepositoryGetter: Getter<TocadorRepository>, @repository.getter('ApresentacaoRepository') protected apresentacaoRepositoryGetter: Getter<ApresentacaoRepository>,
  ) {
    super(TocadorApresentacao, dataSource);
    this.apresentacao = this.createBelongsToAccessorFor('apresentacao', apresentacaoRepositoryGetter,);
    this.registerInclusionResolver('apresentacao', this.apresentacao.inclusionResolver);
    this.tocador = this.createBelongsToAccessorFor('tocador', tocadorRepositoryGetter,);
    this.registerInclusionResolver('tocador', this.tocador.inclusionResolver);
  }
}
