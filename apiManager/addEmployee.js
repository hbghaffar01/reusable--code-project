import api from '@/apiManager/apiManager'

export const getEmployees = data => {
  const url = `/corporate-admin/employees/list?limit=${data.limit}&offset=${data.offset}&key=${data.key}&status=ACTIVE`
  return api('get', url, '', 'base')
}

export const getSlugUrl = () => {
  const url = '/corporate-admin/employees/corporate-url'
  return api('get', url, '', 'base')
}

export const addEmployee = data => {
  const url = '/corporate-admin/employees/add'
  return api('post', url, data, 'base')
}

export const searchEmployees = query => {
  const url = `/corporate-admin/employees/search?query=${query}`
  return api('get', url, '', 'base')
}

export const deleteEmployee = (id, status) => {
  const url = `/corporate-admin/employees/${id}?status=${status}`
  return api('delete', url, '', 'base')
}
export const getCorporateUrl = data => {
  const url = '/corporate-admin/employees/corporate-url-exist'
  return api('post', url, data, 'base')
}
export const updateCorporateUrl = data => {
  const url = '/corporate-admin/employees/corporate-url'
  return api('patch', url, data, 'base')
}
