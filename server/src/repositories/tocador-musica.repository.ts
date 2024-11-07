import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {InstrumentoMusica, MusicaApresentacao, Tocador, TocadorMusica, TocadorMusicaRelations} from '../models';
import {InstrumentoMusicaRepository} from './instrumento-musica.repository';
import {MusicaApresentacaoRepository} from './musica-apresentacao.repository';
import {TocadorRepository} from './tocador.repository';

export class TocadorMusicaRepository extends DefaultCrudRepository<
  TocadorMusica,
  typeof TocadorMusica.prototype.id,
  TocadorMusicaRelations
> {


  public readonly musicaApresentacao: BelongsToAccessor<MusicaApresentacao, typeof TocadorMusica.prototype.id>;

  public readonly tocador: BelongsToAccessor<Tocador, typeof TocadorMusica.prototype.id>;

  public readonly instrumentoMusica: BelongsToAccessor<InstrumentoMusica, typeof TocadorMusica.prototype.id>;

  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource,
    @repository.getter('MusicaApresentacaoRepository') protected musicaApresentacaoRepositoryGetter: Getter<MusicaApresentacaoRepository>,
    @repository.getter('TocadorRepository') protected tocadorRepositoryGetter: Getter<TocadorRepository>,
    @repository.getter('InstrumentoMusicaRepository') protected instrumentoMusicaRepositoryGetter: Getter<InstrumentoMusicaRepository>,
  ) {
    super(TocadorMusica, dataSource);
    this.instrumentoMusica = this.createBelongsToAccessorFor('instrumentoMusica', instrumentoMusicaRepositoryGetter,);
    this.registerInclusionResolver('instrumentoMusica', this.instrumentoMusica.inclusionResolver);
    this.tocador = this.createBelongsToAccessorFor('tocador', tocadorRepositoryGetter,);
    this.registerInclusionResolver('tocador', this.tocador.inclusionResolver);
    this.musicaApresentacao = this.createBelongsToAccessorFor('musicaApresentacao', musicaApresentacaoRepositoryGetter,);
    this.registerInclusionResolver('musicaApresentacao', this.musicaApresentacao.inclusionResolver);

  }
}
