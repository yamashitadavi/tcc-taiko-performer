import { ToastType } from "../components/enums/Enums";

export function showToast(title? : string, text? : string, type? : ToastType) {
    dispatchEvent(new CustomEvent('toast', {detail: {title, text, type}}));
}

export function showError(title? : string, text? : string) {
    showToast(title, text, ToastType.error)
}

export function formatDate(dt : any) {
    if (typeof dt == 'object') {    
        return `${addZero(dt.getDate())}/${addZero(dt.getMonth()+1)}/${dt.getFullYear()}`
    }
    const [y,m,d] = dt.slice(0, 10).split('-')
    return `${d}/${m}/${y}`;
}

export function formatDateTime(dt: any) {
    //convert dt to current timezone 
    dt = new Date(dt)

    // const [y,m,d, h, min, s] = dt.split('T')[0].split('-').concat(dt.replace('.000Z', '').split('T')[1].split(':'))
    // return `${d}/${m}/${y} ${h}:${min}:${s}`;

    return dt.toLocaleString();
}

export function isEmptyOrWhitespace(input: string) {
    return input.trim().length === 0;
}

export function addZero(num : any) {
    return '0'+num;
}

export function toFormData(obj : any) {
    const formData = new FormData();
    for (const k in obj) {
        console.log('key', k, obj[k]);
        formData.append(k, obj[k])
    }
    return formData
}

export function renameFile(originalFile: any, newName : any) {
    console.log('newName', newName)
    console.log('originalFile', originalFile)
    return new File(originalFile, newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

export function customRedirect(pageName: string){ window.location.href = window.location.origin +`/${pageName}`; }

export function getUrlParams() {
    const params : any = {}

    const strParam = window.location.href.split('?')[1]

    if (strParam) {
        strParam.split('&').forEach(e=>{
            const [ key, val ] = e.split('=')
            params[key] = val

        })
    }
    return params
}