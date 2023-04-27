import api from '@/apiManager/apiManager'

export const getInstructors = data => {
  const url = `/corporate-admin/activity-schedule/instructor?limit=${data.limit}&offset=${data.offset}&filter=${data.filter}`
  return api('get', url, '', 'base')
}
export const setInstructor = data => {
  const url = '/corporate-admin/activity-schedule/instructor'
  return api('post', url, data, 'base')
}

export const deleteInstructor = (id, status) => {
  const url = `/corporate-admin/activity-schedule/instructor/${id}?status=${status}`
  return api('delete', url, '', 'base')
}

export const updateInstructor = (id, data) => {
  const url = `/corporate-admin/activity-schedule/instructor/${id}`
  return api('patch', url, data, 'base')
}
