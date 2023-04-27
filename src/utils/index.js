const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const weekDaysShortName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const currentDate = short => {
  const current = new Date()
  const getDate = current.getDate()
  const monthName = month[current.getMonth()]
  const monthShort = monthShortNames[current.getMonth()]
  const getFullYear = current.getFullYear()
  if (short) {
    return `${getDate} ${monthShort}`
  }
  return `${getDate} ${monthName} ${getFullYear}`
}

export const makeToast = (ref, msg, variant) => {
  ref.toast(msg, {
    title: variant,
    autoHideDelay: 5000,
    variant,
    appendToast: true,
  })
}

export const getCurrentDateToLocaleString = () => {
  const date = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}
export const getCurrentDateAndTime = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export const copyToClipboard = data => {
  navigator.clipboard.writeText(data)
  return true
}

export const getStatus = (date, duration) => {
  const currentDate = new Date()
  const eventDate = new Date(date)
  const timeDiffInMinutes = Math.floor((eventDate - currentDate) / (1000 * 60))

  if (currentDate < eventDate) {
    return 'Upcoming'
  }

  if (currentDate >= eventDate && currentDate < new Date(eventDate.getTime() + duration * 60000)) {
    if (timeDiffInMinutes <= 30) {
      return 'Check-in started'
    }
    return 'Not started yet'
  }

  if (timeDiffInMinutes <= 10) {
    const remainingMinutes = Math.floor(timeDiffInMinutes % 60)
    const remainingSeconds = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes
    return timeDiffInMinutes > 0 ? `Ending in ${Math.floor(timeDiffInMinutes / 60)}:${remainingSeconds}` : 'Completed'
  }

  if (currentDate >= new Date(eventDate.getTime() + duration * 60000)) {
    return 'Completed'
  }

  return 'On-going'
}

export const formattedDate = time => {
  const dateStr = time.split('T')[0]
  const date = new Date(dateStr)
  const daysOfWeek = weekDaysShortName
  const monthsOfYear = monthShortNames
  const dayOfWeek = daysOfWeek[date.getDay()]
  const monthOfYear = monthsOfYear[date.getMonth()]
  const dayOfMonth = date.getDate()
  const year = date.getFullYear()
  return `${dayOfWeek}, ${monthOfYear} ${dayOfMonth} ${year}`
}

export const formattedDuration = (time, duration) => {
  if (!time) {
    return ''
  }
  const startDate = new Date(Date.parse(time))
  const localStartDate = new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60000)
  const localEndDate = new Date(localStartDate.getTime() + duration * 60000)
  const startTime = localStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endTime = localEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startTime} - ${endTime}`
}

export const startTime = (time, duration) => {
  if (!time) {
    return ''
  }
  const startDate = new Date(time)

  const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startTime}`
}

export const dateFormat = date => {
  const monthNames = monthShortNames
  const extractedDate = date.split('T')[0].split('-')
  const day = extractedDate[0]
  const month = extractedDate[1]
  const year = extractedDate[2]
  return `${year} ${monthNames[month - 1]} ${day} `
}

export const getPaymentType = (free, online) => {
  const physical = online ? '' : 'Physical'
  const type = free ? 'Free' : 'Paid'
  const virtual = online ? 'Virtual' : ''

  return `${type} - ${virtual}${physical}` || '-'
}
