import { toFormData } from "../../functions/utils";

export abstract class DBTable {
    id? : number
    toDb() : DBTable {
        return this;
    }
}

export class Tocador extends DBTable {
    nome : string = ''
    dataEntrada : string = ''

    constructor(obj? : Partial<Tocador>) {
        super()
        if (obj) {
            Object.assign(this, obj)
            this.dataEntrada = this.dataEntrada.slice(0,10)
        }
    }

    toDb() : Tocador {
        const entity = new Tocador(this)
        entity.dataEntrada = entity.dataEntrada+'T00:00:00z'

        return entity
    }
}

export class Musica extends DBTable {
    nome : string = ''
    tempo : number = 0
    layoutX : number = 1280
    layoutY : number = 720
    espaco : number = 100 //linha

    get largura() { return this.layoutX+'' }
    set largura(value) { this.layoutX = parseInt(value)}
    get altura() { return this.layoutY+'' }
    set altura(value) { this.layoutY = parseInt(value)}
    get linhas() { return this.espaco+'' }
    set linhas(value) { this.espaco = parseInt(value); console.log('ue vei')}

    get tempoMin() { return this.tempo+'' }
    set tempoMin(value) { this.tempo = parseInt(value) }

    constructor(obj? : Partial<Musica>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb(): Musica {
        const entity = new Musica(this)

        return entity
    }
}


export class Instrumento extends DBTable {
    nome : string = ''
    files : any = ''
    _imagem : any
    tipoImagem : string = ''
    tamanhoX : number = 0
    tamanhoY : number = 0
    get tamX() { return this.tamanhoX+'' }
    set tamX(value) { this.tamanhoX = parseInt(value)}
    get tamY() { return this.tamanhoY+'' }
    set tamY(value) { this.tamanhoY = parseInt(value)}

    constructor(obj? : Partial<Instrumento>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb(): Instrumento {
        const entity = new Instrumento(this)
        delete entity._imagem
        return entity
    }

    toFormData() : FormData {
        return toFormData(this)
    }

}

export class InstrumentoMusica extends DBTable {
    instrumentoId : number = 0
    musicaId : number = 0
    nome : string = ''
    posicaoX : number = 0
    posicaoY : number = 0
    terTocador : boolean = true 
    tamanhoX : number = 0
    tamanhoY : number = 0
    instrumento : Instrumento|undefined 
    musica : Musica|undefined

    get posX() { return this.posicaoX+'' }
    set posX(value) { this.posicaoX = parseInt(value)}
    get posY() { return this.posicaoY+'' }
    set posY(value) { this.posicaoY = parseInt(value)}

    get tamX() { return this.tamanhoX+'' }
    set tamX(value) { this.tamanhoX = parseInt(value)}
    get tamY() { return this.tamanhoY+'' }
    set tamY(value) { this.tamanhoY = parseInt(value)}
    

    constructor(obj? : Partial<InstrumentoMusica>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb(): InstrumentoMusica {
        const entity = new InstrumentoMusica(this)
        //entity.instrumento = undefined
        //entity.musica = undefined
        delete entity.instrumento
        delete entity.musica
        return entity
    }

}

export class Apresentacao extends DBTable {
    nome : string = ''
    dataHora : string = ''
    local : string = ''
    observacoes : string = ''

    get dataHoraTZ() {
        if (!this.dataHora) return ''
        //new Date(this.dataHora)
        /*       const dt = new Date(this.dataHora)
        dt.setTime(dt.getTime()+(new Date().getTimezoneOffset()*60000))
        console.log(dt.toISOString())
        return (dt.toISOString()).split('.')[0] */
        if (this.dataHora.includes('Z')) {
            this.dataHora = new Date(new Date(this.dataHora).getTime() - (new Date().getTimezoneOffset()*60000)).toISOString().split('.')[0]
        }   

        return this.dataHora
    }
    set dataHoraTZ(value) {
        this.dataHora = new Date(value).toISOString()
    }
    
    get apresentado() {
        return this.dataHora ? new Date(this.dataHora).getTime() >= new Date().getTime() : false
    }

    constructor(obj? : Partial<Apresentacao>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb(): Apresentacao {
        const entity = new Apresentacao(this)
        this.dataHora = new Date(this.dataHora).toISOString();
        return entity
    }
}

export class TocadorApresentacao extends DBTable {
    apresentacaoId: number = 0
    tocadorId: number = 0
    tocador : Tocador|undefined

    constructor(obj? : Partial<TocadorApresentacao>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb() : TocadorApresentacao {
        return new TocadorApresentacao(this)
    }
}

export class TocadorMusica extends DBTable {
    musicaApresentacaoId: number = 0
    tocadorId: number = 0
    instrumentoMusicaId: number = 0
    tocador : Tocador|undefined

    constructor(obj? : Partial<TocadorMusica>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb() : TocadorMusica {
        return new TocadorMusica(this)
    }
}


export class MusicaAprendida extends DBTable {
    musicaId: number = 0;
    tocadorId: number = 0;
    instrumentoMusicaId: number = 0;

    constructor(obj? : Partial<MusicaAprendida>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb() : MusicaAprendida {
        return new MusicaAprendida(this)
    }
}

export class MusicaApresentacao extends DBTable {
    apresentacaoId: number = 0;
    musicaId: number = 0
    ordem: number = 0
    musica : Musica|undefined


    constructor(obj? : Partial<MusicaApresentacao>) {
        super()
        if (obj) {
            Object.assign(this, obj)
        }
    }

    toDb() : MusicaApresentacao {
        return new MusicaApresentacao(this)
    }
}