import api from '@/apiManager/apiManager'

export const createZone = data => {
  const url = '/corporate-admin/activity-schedule/zone'
  return api('post', url, data, 'base')
}
export const fetchZones = () => {
  const url = '/corporate-admin/activity-schedule/zones'
  return api('get', url, '', 'base')
}
