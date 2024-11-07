import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {MusicaApresentacao, MusicaApresentacaoRelations, Apresentacao, Musica} from '../models';
import {ApresentacaoRepository} from './apresentacao.repository';
import {MusicaRepository} from './musica.repository';

export class MusicaApresentacaoRepository extends DefaultCrudRepository<
  MusicaApresentacao,
  typeof MusicaApresentacao.prototype.id,
  MusicaApresentacaoRelations
> {

  public readonly apresentacao: BelongsToAccessor<Apresentacao, typeof MusicaApresentacao.prototype.id>;

  public readonly musica: BelongsToAccessor<Musica, typeof MusicaApresentacao.prototype.id>;

  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource, @repository.getter('ApresentacaoRepository') protected apresentacaoRepositoryGetter: Getter<ApresentacaoRepository>, @repository.getter('MusicaRepository') protected musicaRepositoryGetter: Getter<MusicaRepository>,
  ) {
    super(MusicaApresentacao, dataSource);
    this.musica = this.createBelongsToAccessorFor('musica', musicaRepositoryGetter,);
    this.registerInclusionResolver('musica', this.musica.inclusionResolver);
    this.apresentacao = this.createBelongsToAccessorFor('apresentacao', apresentacaoRepositoryGetter,);
    this.registerInclusionResolver('apresentacao', this.apresentacao.inclusionResolver);
  }
}
