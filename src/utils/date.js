export const getRelativeDate = (unixMs) => {
  const now = new Date()
  const date = new Date(unixMs)
  const diff = now - date
  const minuteDiff = Math.floor(diff / 60000)
  const hourDiff = Math.floor(diff / 3600000)
  const dayDiff = Math.floor(diff / 86400000)

  if (minuteDiff === 0) {
    return 'now'
  } else if (minuteDiff < 60) {
    return `${minuteDiff} ${minuteDiff != 1 ? 'minutes' : 'minute'} ago`
  } else if (hourDiff < 24) {
    return `${hourDiff} ${hourDiff > 1 ? 'hours' : 'hour'} ago`
  } else if (dayDiff < 30) {
    return `${dayDiff} ${dayDiff > 1 ? 'days' : 'day'} ago`
  } else {
    return date.toLocaleDateString()
  }
}
