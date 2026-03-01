
export const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

export const formatTime = (time: string) => {
    const timeObj = new Date(time)
    return timeObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}

export const formatDayMonth = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })
}

export const formatDateSafe = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}