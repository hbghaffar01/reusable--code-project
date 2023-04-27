import api from '@/apiManager/apiManager'

export const getAllChallenges = data => {
  const url = `/corporate-admin/gamification/challenges?limit=${data.limit}&offset=${data.offset}&type=${data.type}&currentDate=${data.currentDate}`
  return api('get', url, '', 'base')
}

export const createChallenge = data => {
  const url = '/corporate-admin/gamification/challenge'
  return api('post', url, data, 'base')
}

export const updateChallenge = (data, id) => {
  const url = `/corporate-admin/gamification/challenge/${id}`
  return api('patch', url, data, 'base')
}

export const deleteChallenge = id => {
  const url = `/corporate-admin/gamification/challenge/${id}`
  return api('delete', url, '', 'base')
}

export const deleteBooking = data => {
  const url = `/corporate-admin/gamification/participants/${data.id}?challengeId=${data.challengeId}`
  return api('delete', url, '', 'base')
}
// leader board
export const getChallengeById = data => {
  const url = '/get-challenge-by-id'
  return api('post', url, data, 'gamification')
}

export const getChallengeParticipents = data => {
  const url = '/get-challenge-cache-participants'
  return api('post', url, data, 'gamification')
}

