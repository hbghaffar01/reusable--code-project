import api from '@/apiManager/apiManager'

export const createScheduleActivity = data => {
  const url = '/corporate-admin/activity-schedule/create'
  return api('post', url, data, 'base')
}
export const getScheduleActivity = data => {
  const startDateQuery = data.startDate ? `&startDate=${data.startDate}` : ''
  const endDateQuery = data.endDate ? `&endDate=${data.endDate.split('T')[0]}T23:59:59.000Z` : ''
  const url = `/corporate-admin/activity-schedule/all?limit=${data.limit}&offset=${data.offset}&activityTypeIds=${data.activityTypeIds}&activityZoneIds=${data.activityZoneIds}&instructorIds=${data.instructorIds}${startDateQuery}${endDateQuery}`
  return api('get', url, '', 'base')
}
export const getScheduleActivityType = () => {
  const url = '/corporate-admin/activity-schedule/activity'
  return api('get', url, '', 'base')
}
export const createScheduleActivityType = data => {
  const url = '/corporate-admin/activity-schedule/activity'
  return api('post', url, data, 'base')
}

export const deleteScheduleActivityType = id => {
  const url = `/corporate-admin/activity-schedule/${id}`
  return api('delete', url, '', 'base')
}
export const getActivityType = () => {
  const url = '/corporate-admin/group/activity_types'
  return api('get', url, '', 'base')
}
export const getScheduleInstructor = () => {
  const url = '/corporate-admin/activity-schedule/instructor'
  return api('get', url, '', 'base')
}

export const updateScheduleActivity = (data, id) => {
  const url = `/corporate-admin/activity-schedule/${id}`
  return api('put', url, data, 'base')
}
