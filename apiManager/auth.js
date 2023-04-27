import api from '@/apiManager/apiManager'

export const loginUser = data => {
  const url = '/corporate-admin/auth/login'
  return api('post', url, data, 'base')
}

export const forgotPassword = data => {
  const url = '/auth/forgot-password'
  return api('post', url, data, 'reset')
}

export const recoverPassword = data => {
  const url = '/auth/reset-password'
  return api('post', url, data, 'reset')
}

export const refreshAccessToken = () => {
  const userData = JSON.parse(localStorage.getItem('userData'))
  const data = {
    refreshToken: localStorage.getItem('refreshToken'),
    userName: userData.username,
  }
  const url = '/corporate-admin/auth/refresh-token'
  return api('post', url, data, 'base')
}
