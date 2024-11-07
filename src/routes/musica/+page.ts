import type { PageLoad } from "../$types";
import { getTable } from "../functions/request";

export const load : PageLoad = async ({fetch}) => {
    let { response } = await (getTable('/musicas', { }, fetch))
    return { response: (response).map((e : any) => { 
        e.recordUrl = './musica/'+e.id  ;
        return e;
    }) }
}