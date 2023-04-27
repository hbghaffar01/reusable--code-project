import axios from 'axios'
import { refreshAccessToken } from '@/apiManager/auth'

const axiosApiInstance = axios.create()

const getBaseUrl = baseUrl => ({
  base: process.env.VUE_APP_BASE_URL,
  gamification: process.env.VUE_APP_GAMIFICATION,
  media: process.env.VUE_APP_MEDIA_SERVICE,
  reset: process.env.VUE_APP_RESET_SERVICE,
  instructor: process.env.VUE_APP_INSTRUCTORS,
  zone: process.env.VUE_APP_ZONE,
  attendance: process.env.VUE_APP_ATTENDANCE,
  challenge: process.env.VUE_APP_CHALLENGE,
}[baseUrl])
const getToken = () => localStorage.getItem('token')

const getAuthHeader = service => {
  const token = getToken()
  if (service === 'other') {
    return token
      ? {
        auth: `Bearer ${token}`,
      }
      : {}
  }
  return token
    ? {
      Authorization: `Bearer ${token}`,
    }
    : {}
}

const getConfigurations = (configurations, service) => ({
  headers: {
    ...getAuthHeader(service),
  },
  ...configurations,
})
const getParams = (...params) => params.filter(param => !!param)

const api = (
  type,
  url,
  data = null,
  service = 'other',
  configurations = {},
) => {
  const params = getParams(
    getBaseUrl(service) + url,
    data,
    getConfigurations(configurations, service),
  )
  return axios[type](...params)
    .then(response => response.data)
    .catch(async error => {
      const originalRequest = error.config
      if (error.response.status === 401 || error.response.status === 403) {
        originalRequest._retry = true
        const accessToken = await refreshAccessToken()
        localStorage.setItem('token', `${accessToken.data.jwtToken}`)
        originalRequest.headers.Authorization = `Bearer ${accessToken.data.jwtToken}`
        window.location.reload()
        return axiosApiInstance(originalRequest)
      } if (error.response.status === 400 && url.includes('refresh-token')) {
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        window.location.href = '/'
      } else {
        return error.response.data
      }
    })
}

export default api
