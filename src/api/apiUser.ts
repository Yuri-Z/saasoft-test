import {type iUser} from '@/stores/user.ts'

export default {
  post: (users: iUser[]) => {
    localStorage.setItem('users', JSON.stringify(users))
  },

  put: (users: iUser[]) => {
    localStorage.setItem('users', JSON.stringify(users))
  },

  get: (): iUser[] => {
    let response: string | null = localStorage.getItem("users")

    if (typeof response !== 'string') return []

    return JSON.parse(response)
  }
}
