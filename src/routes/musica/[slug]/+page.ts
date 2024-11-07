import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "../$types";
import { Instrumento, InstrumentoMusica, Musica } from "../../components/classes/classes";
import { getTable } from "../../functions/request";

const musicaAprensdidaQry = {
    
    "fields": {
        "id": true,
        "tocadorId": true,
        "musicaId": true,
        "instrumentoMusicaId": true
    },
    "include": [
        {
        "relation": "instrumentoMusica",
        "scope": {"fields": { "nome": true } }
        },
        {
        "relation": "tocador",
        "scope": {"fields": { "nome": true } }
        
        }
    ]
    
}

export const load : PageLoad = async ({params, fetch}) => {

    const [ musica, instrumentos, instrumentosMusica, tocadorInstrumento ] = (await Promise.all([
        getTable('/musicas/'+params.slug, {}, fetch),
        getTable('/instrumentos', {}, fetch),
        getTable('/instrumento-musica', { where: { musicaId: params.slug} }, fetch),
        getTable('/musica-aprendida', { 
            ...musicaAprensdidaQry,
            where: { musicaId: params.slug } 
        }, fetch)
    ])).map(({ response, ok }) => {
        if (!ok) throw redirect(301, '/404')
        return response
    });

    //let { response, ok } = await getTable('/musicas/'+params.slug, {}, fetch)
 
    return { response: {
        musica: new Musica(musica),
        instrumentos: instrumentos.map((e : any) => new Instrumento(e)),
        instrumentosMusica: instrumentosMusica.map((e : any) => new InstrumentoMusica(e)),
        tocadorInstrumento: tocadorInstrumento.reduce((acc : any, e : any) => {
            if (!acc[e.tocadorId]) acc[e.tocadorId] = { value: { }, label: e.tocador.nome };

            acc[e.tocadorId].value[e.instrumentoMusicaId] = e.id
            return acc;
        }, {} /*tocadorId: Set(instrumentoMusicaId)}*/)
    } };
} 