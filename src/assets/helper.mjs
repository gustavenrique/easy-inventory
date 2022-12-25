import Swal from 'sweetalert2'

export const areObjectsEqual = (first, second) => {
    let firstKeys = Object.keys(first)
    let secondKeys = Object.keys(second)
    
    if (firstKeys.length !== secondKeys.length) return false
    
    for (let key of firstKeys) {
        const areValuesAnObject = isObject(first[key]) && isObject(second[key])
        
        if ((areValuesAnObject && !areObjectsEqual(first[key], second[key])) || (!areValuesAnObject && first[key] !== second[key]))
        return false
    }
    
    return true
}

export const isObject = (object) => object != null && typeof object === 'object'

export function AlertCancelamento(modalId, funcaoLimparFormulario) {
    Swal.fire({
        title: 'Tem certeza?',
        text: 'Os dados inseridos serão perdidos. Realmente deseja cancelar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, cancele',
        cancelButtonText: 'Não, volte'
    }).then(result => {
        if (result.isConfirmed) {
            funcaoLimparFormulario()
            $(modalId).modal('hide')
        }
    })
}