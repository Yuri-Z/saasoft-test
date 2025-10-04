export interface iUser {
  id: string,
  marks: string[],
  type: 'LDAP' | 'Локальная',
  login: string,
  password: string | null
}

export default {
  post: (users: iUser[]) => {
    localStorage.setItem('users', JSON.stringify(users))
  },

  get: (): iUser[] => {
    let response: string | null = localStorage.getItem("users")

    if (typeof response !== 'string') return []

    return JSON.parse(response)
  }
}
