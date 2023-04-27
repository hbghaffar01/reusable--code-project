import api from '@/apiManager/apiManager'

export const activityAttendees = data => {
  const url = `/corporate-admin/attendance-management/activity-attendees/${data.id}?limit=${data.limit}&offset=${data.offset}&name=${data.name}`
  return api('get', url, '', 'base')
}

export const deleteParticipants = id => {
  const url = `/corporate-admin/attendance-management/activity-participant/${id}`
  return api('delete', url, '', 'base')
}

export const checkInParticipants = data => {
  const url = `/corporate-admin/attendance-management/check-in-participant/${data.id}?userId=${data.userId}`
  return api('patch', url, data, 'base')
}

export const getActivityInformation = id => {
  const url = `/corporate-admin/activity-schedule/${id}`
  return api('get', url, '', 'base')
}

export const updateScheduleActivitySlots = (data, id) => {
  const url = `/corporate-admin/activity-schedule/${id}`
  return api('put', url, data, 'base')
}
