import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {MusicaAprendida, MusicaAprendidaRelations, Tocador, Musica, InstrumentoMusica} from '../models';
import {TocadorRepository} from './tocador.repository';
import {MusicaRepository} from './musica.repository';
import {InstrumentoMusicaRepository} from './instrumento-musica.repository';

export class MusicaAprendidaRepository extends DefaultCrudRepository<
  MusicaAprendida,
  typeof MusicaAprendida.prototype.id,
  MusicaAprendidaRelations
> {

  public readonly tocador: BelongsToAccessor<Tocador, typeof MusicaAprendida.prototype.id>;

  public readonly musica: BelongsToAccessor<Musica, typeof MusicaAprendida.prototype.id>;

  public readonly instrumentoMusica: BelongsToAccessor<InstrumentoMusica, typeof MusicaAprendida.prototype.id>;

  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource, @repository.getter('TocadorRepository') protected tocadorRepositoryGetter: Getter<TocadorRepository>, @repository.getter('MusicaRepository') protected musicaRepositoryGetter: Getter<MusicaRepository>, @repository.getter('InstrumentoMusicaRepository') protected instrumentoMusicaRepositoryGetter: Getter<InstrumentoMusicaRepository>,
  ) {
    super(MusicaAprendida, dataSource);
    this.instrumentoMusica = this.createBelongsToAccessorFor('instrumentoMusica', instrumentoMusicaRepositoryGetter,);
    this.registerInclusionResolver('instrumentoMusica', this.instrumentoMusica.inclusionResolver);
    this.musica = this.createBelongsToAccessorFor('musica', musicaRepositoryGetter,);
    this.registerInclusionResolver('musica', this.musica.inclusionResolver);
    this.tocador = this.createBelongsToAccessorFor('tocador', tocadorRepositoryGetter,);
    this.registerInclusionResolver('tocador', this.tocador.inclusionResolver);
  }
}
