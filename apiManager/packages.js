import api from '@/apiManager/apiManager'

export const createPackage = data => {
  const url = '/corporate-admin/packages'
  return api('post', url, data, 'base')
}

export const getPackagesList = data => {
  const url = `/corporate-admin/packages/list?limit=${data.limit}&offset=${data.offset}`
  return api('get', url, '', 'base')
}

export const getPackagesListType = () => {
  const url = '/corporate-admin/packages/listPackageTypes'
  return api('get', url, '', 'base')
}

export const deletePackage = id => {
  const url = `/corporate-admin/packages/${id}`
  return api('delete', url, '', 'base')
}

export const updatePackage = (id, data) => {
  const url = `/corporate-admin/packages/${id}`
  return api('patch', url, data, 'base')
}
