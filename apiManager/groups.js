import api from '@/apiManager/apiManager'

export const getAllGroups = data => {
  const url = '/corporate-admin/group/all'
  return api('post', url, data, 'base')
}

export const getGroupActivityTypes = () => {
  const url = '/corporate-admin/group/activity_types'
  return api('get', url, '', 'base')
}

export const addGroup = data => {
  const url = '/corporate-admin/group/groups'
  return api('post', url, data, 'base')
}

export const deleteGroup = id => {
  const url = `/corporate-admin/group/${id}`
  return api('delete', url, '', 'base')
}

export const updateGroup = (data, id) => {
  const url = `/corporate-admin/group/${id}`
  return api('put', url, data, 'base')
}
