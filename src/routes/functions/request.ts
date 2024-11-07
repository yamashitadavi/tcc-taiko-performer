import config from '../config.json'
import { translateError } from './errorHandler';

type FetchFunction = (url: string, options?: RequestInit) => Promise<Response>;

//implementa a mensagem de erro direito filho

export async function getTable(dir : string, filter : object, fetch : FetchFunction) {
    try {
        const response = await fetch(`${config.request_url}${dir}?filter=` +
        encodeURIComponent(JSON.stringify(filter)),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return ({ ok: true, response: await response.json() });
    } catch (e : unknown) {
        dispatchEvent(new CustomEvent('modal-error', {detail: {title : 'Erro', body: e}}))
        return ({ ok: false })
    }
}

export async function upsertTable(dir : string, body : unknown, fetch : FetchFunction, id? : unknown) {
    
    const state = { ok: false, message: '', body : { id: '' } }
    try {
        const isFormData = body instanceof FormData;
        console.log('body', body)
        console.log('dir', dir)
        console.log('isFormData',isFormData)
        const response = await fetch(`${config.request_url}${dir}${id ? '/' + id : ''}`,
            {
                method: id != undefined ? 'PATCH' : 'POST',
                headers: isFormData ? {} : {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: isFormData ? body : JSON.stringify(body)
            }
        )
        console.log(response)
        if (!(state.ok = response.ok)) {
            const {error} = await response.json()
            console.log(error)
            state.message = translateError(error, dir)
            throw new Error(state.message);
        }

        if (response.status != 204)
        state.body = await response.json();
    } catch (e : unknown) {
        dispatchEvent(new CustomEvent('modal-error', {detail: {title : 'Erro', body: e}}))
    }
    return state;
    
}

export async function deleteRowTable(dir : string, fetch : FetchFunction, id : unknown) {
    console.log('try delete')
    const state = { ok: false, message: '' }
    try {
        const response = await fetch(`${config.request_url}${dir}/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        if (!(state.ok = response.ok)) {
            console.log('error')
            const {error} = await response.json()
            console.log(error)
            state.message = translateError(error, dir)
        }
    } catch (e : unknown) {
        dispatchEvent(new CustomEvent('modal-error', {detail: {title : 'Erro', body: e}}))
    }
    return state

}

/*export async function createFile(dir : string, body : any, fetch : Function, id? : any) {
    let state = { ok: false, message: '', body : { id: '' } }

    try {
        let response = await fetch(`${config.request_url}${dir}${id ? '/' + id : ''}`,
            {
                method: id != undefined ? 'PATCH' : 'POST',

                body: body 
            }
        )
        console.log(response)
        if (!(state.ok = response.ok)) {
            let {error} = await response.json()
            console.log(error)
            state.message = translateError(error, dir)
        }

        if (response.status != 204)
        state.body = await response.json();
    } catch (e : any) {
        dispatchEvent(new CustomEvent('modal-error', {detail: {title : 'Erro', body: e}}))
    }
    return state;
} */

