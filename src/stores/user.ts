import { defineStore } from 'pinia'
import {ref} from 'vue'
import apiUser from '../api/apiUser.ts'
import type {iUser} from "../api/apiUser.ts"

export const useUserStore = defineStore('userStore', () => {
  const users = ref<iUser[]>([])

  const getUsers = () => {
    users.value = apiUser.get()

    return users.value
  }
  const postUser = () => {
    apiUser.post(users.value)
  }

  const deleteUser = (id: string) => {
    const index = users.value.findIndex(item => item.id === id)

    users.value.splice(index, 1)

    apiUser.post(users.value)
  }

  return {users, getUsers, postUser, deleteUser}
})
