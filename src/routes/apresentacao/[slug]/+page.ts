import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "../$types";
import { InstrumentoMusica, MusicaApresentacao, TocadorMusica } from "../../components/classes/classes";
import { getTable } from "../../functions/request";
import { request_url } from '../../config.json'

export const load : PageLoad = async ({params, fetch}) => {

    const [ apresentacao, musicaApresentacao ] = (await Promise.all([
        getTable('/apresentacoes/'+params.slug, {}, fetch),
        getTable('/musica-apresentacao', {
            include: [
                { relation: 'musica' }
            ],
            where: { apresentacaoId: params.slug }
        }, fetch)
        
    ])).map(({ response, ok }) => {
        if (!ok) throw redirect(301, '/404')
        return response;
    })

    const tocadorMusica = (await getTable('/tocador-musica', {
        include: [
            { relation: 'tocador', scope: { fields: { id: true, nome: true } } }
        ],
        where: {
            musicaApresentacaoId: { inq: musicaApresentacao.map((e : any) => e.id) }
        }
    }, fetch)).response

    console.table(apresentacao)
    console.table(musicaApresentacao)
    console.table(tocadorMusica)

    const musicaSet = new Set()

    const musApreIdJunct : any = musicaApresentacao.reduce((acc : any, e : any) => {
        acc[e.id] = { musicaApre: new MusicaApresentacao(e), tocadores: {} }
        musicaSet.add(e.musicaId)
        return acc;
    }, {})

    const { response : instrumentosMus, ok } = await getTable(`/instrumento-musica`, {
        include: [
            { relation: 'instrumento', scope: { fields: { nome: true, tipoImagem: true } } }
        ],
        where: { musicaId: { inq: [...musicaSet] }}
    }, fetch)
    tocadorMusica.forEach((e : any) => {
        if (!musApreIdJunct[e.musicaApresentacaoId].tocadores) musApreIdJunct[e.musicaApresentacaoId].tocadores = {}
        musApreIdJunct[e.musicaApresentacaoId].tocadores[e.instrumentoMusicaId] = new TocadorMusica(e) 

    })
    
    if (ok) {
        console.log('ok',instrumentosMus)
        const musicaInstrumentos = instrumentosMus.reduce((acc : any, e : any) => {
            console.log(e)
            e.instrumento._imagem = `${request_url}/instrumentos/icone/${e.instrumentoId}.${e.instrumento.tipoImagem || 'png'}`
            
            if (!acc[e.musicaId]) acc[e.musicaId] = []
            acc[e.musicaId].push(new InstrumentoMusica(e))

            return acc;
        }, {})

        for (const x in musApreIdJunct) {
            musApreIdJunct[x].instrumentos = musicaInstrumentos[musApreIdJunct[x].musicaApre.musicaId]
        }
    }
    console.log('musApreIdJunct', musApreIdJunct)
    const k =  Object.values(musApreIdJunct).sort((a : any , b : any) => a.musicaApre.ordem - b.musicaApre.ordem);

    console.log('k',  JSON.stringify(k))
    const res = { response: { 
        apresentacao: apresentacao, 
        musApreJunct: k
    } };
    return res
}