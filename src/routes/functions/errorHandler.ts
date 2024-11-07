
/**
 * { form: { name: label } }
 */
export const formLabel : any = {}

const errors : any = {
    500: [
       ['Internal', 'Erro interno do servidor'], 
       ['Duplicate entry', (message : string, formType : string) => {
        console.log('am?')
        const [val, field] : any = message.match(/'[^']*'/g)
        const fieldNoQuote = field.replaceAll('\'','').split('.')[1]
        return `Valor duplicado ${val} em '${(formLabel[formType] || {})[fieldNoQuote] || fieldNoQuote}' `
       }],
       
    ]
}

let formLabelListening = false;

export function formLabelListener() {
    if (formLabelListening) return
    formLabelListening = true;
    window.addEventListener('form-label', (e : any) => {
        const { name, label, urlForm } = e.detail
        if (name && urlForm && label) {
            if (!formLabel[urlForm]) formLabel[urlForm] = {}
            formLabel[urlForm][name] = label
        }
    })
}

export function translateError({ message, statusCode } : any, formType : string) {
    const translated = errors[statusCode]

    if (typeof translated !== 'object') return message

    for (const [ key, param ] of translated) {
        if (message.startsWith(key)) {
            return typeof param == 'function' ? param(message, formType) : param
        }
    }
}