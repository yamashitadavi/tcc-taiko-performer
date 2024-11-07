import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {InstrumentoMusica, InstrumentoMusicaRelations, Instrumento, Musica} from '../models';
import {InstrumentoRepository} from './instrumento.repository';
import {MusicaRepository} from './musica.repository';

export class InstrumentoMusicaRepository extends DefaultCrudRepository<
  InstrumentoMusica,
  typeof InstrumentoMusica.prototype.id,
  InstrumentoMusicaRelations
> {

  public readonly instrumento: BelongsToAccessor<Instrumento, typeof InstrumentoMusica.prototype.id>;

  public readonly musica: BelongsToAccessor<Musica, typeof InstrumentoMusica.prototype.id>;

  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource, @repository.getter('InstrumentoRepository') protected instrumentoRepositoryGetter: Getter<InstrumentoRepository>, @repository.getter('MusicaRepository') protected musicaRepositoryGetter: Getter<MusicaRepository>,
  ) {
    super(InstrumentoMusica, dataSource);
    this.musica = this.createBelongsToAccessorFor('musica', musicaRepositoryGetter,);
    this.registerInclusionResolver('musica', this.musica.inclusionResolver);
    this.instrumento = this.createBelongsToAccessorFor('instrumento', instrumentoRepositoryGetter,);
    this.registerInclusionResolver('instrumento', this.instrumento.inclusionResolver);
  }
}
