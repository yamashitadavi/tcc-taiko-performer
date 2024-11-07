import type { PageLoad } from "../$types";
import { getTable } from "../functions/request";

export const load : PageLoad = async ({fetch}) => {
    let { response } = await (getTable('/tocadores', { }, fetch))
    return { response: (response).map((e : any) => { 
        e.recordUrl = './tocador/'+e.id  ;
        return e;
    }) }
}