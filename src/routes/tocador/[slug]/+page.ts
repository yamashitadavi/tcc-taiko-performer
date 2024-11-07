import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "../$types";
import { Tocador } from "../../components/classes/classes";
import { getTable } from "../../functions/request";

export const load : PageLoad = async ({params, fetch}) => {
    const { response, ok } = await getTable('/tocadores/'+params.slug, {}, fetch)
    if (!ok) throw redirect(301, '/404')
    const res = {response: new Tocador(response)};
    return res
} 