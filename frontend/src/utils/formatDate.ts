
export const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}