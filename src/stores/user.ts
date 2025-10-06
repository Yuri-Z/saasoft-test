import { defineStore } from 'pinia'
import {ref} from 'vue'
import apiUser from '@/api/apiUser.ts'
import generateID from '@/utils/generateID.ts'
import {useToast} from 'primevue/usetoast'

export type tEntityTypes = 'LDAP' | 'Локальная'

export interface iUser {
  id: string,
  marks: {text:string}[],
  type: tEntityTypes,
  login: string,
  password: string | null
}

export interface iRowUser extends Omit<iUser, 'marks'> {
  marks: string
}

export const constEntityTypes: tEntityTypes[] = ['LDAP', 'Локальная']

export const useUserStore = defineStore('userStore', () => {
  const toast = useToast()
  const toastTTL = 5000

  const users = ref<iUser[]>([])

  const getUsers = () => {
    users.value = apiUser.get()

    return users.value
  }

  const addNewUser = () => {
    const newUser: iUser = {
      id: 'temp' + generateID(),
      marks: [],
      type: 'Локальная',
      login: '',
      password: ''
    }

    users.value.push(newUser)
    toast.add({ severity: 'info', summary: 'Добавлен', detail: 'Новый пользователь добавлен в таблицу. Поля записи нуждаются в заполнении', life: toastTTL })
  }
  const putUser = (updatedUser: iUser) => {
    const index = users.value.findIndex(({id}) => id === updatedUser.id)
    users.value[index] = JSON.parse(JSON.stringify(updatedUser))

    apiUser.put(users.value)
    toast.add({ severity: 'success', summary: 'Обновлен', detail: `Пользователь "${updatedUser.login}" обновлён в localStorage`, life: toastTTL })
  }
  const postUser = (updatedUser: iUser) => {
    const index = users.value.findIndex(({id}) => id === updatedUser.id)

    users.value[index] = JSON.parse(JSON.stringify({...updatedUser, id: updatedUser.id.slice(4)}))

    apiUser.post(users.value)
    toast.add({ severity: 'success', summary: 'Сохранен', detail: `Пользователь "${updatedUser.login}" сохранён в localStorage`, life: toastTTL })
  }

  const deleteUser = (user: iUser) => {
    const index = users.value.findIndex(({id}) => id === user.id)

    users.value.splice(index, 1)

    apiUser.post(users.value)
    toast.add({ severity: 'warn', summary: 'Удалён', detail: `Пользователь "${user.login}" удалён из таблицы и из localStorage`, life: toastTTL })
  }

  return {users, getUsers, postUser, putUser, deleteUser, addNewUser}
})
