<script setup lang="ts">
import VTableRow from '@/components/table/vTableRow.vue'
import {computed, onMounted} from 'vue'
import {Button} from 'primevue'
import {type iUser, useUserStore} from '@/stores/user.ts'


const userStore = useUserStore()

const tableIsAvailable = computed(() => !!userStore.users?.length)

const onUpdate = (user: iUser) => {
  const userType = user.id.slice(0,4)
  
  if (userType === 'temp') {
    userStore.postUser(user)
  } else {
    userStore.putUser(user)
  }
}

onMounted(() => {
  userStore.getUsers()
})

</script>

<template>
  <table class="user-table">
    <caption class="user-table__caption">
      <Button variant="text" icon="pi pi-plus" label="Добавить пользователя" @click="userStore.addNewUser" />
    </caption>
    <thead class="user-table__header">
      <tr class="user-table__header-row">
        <th class="user-table__header-deposit">Метки</th>
        <th class="user-table__header-deposit">Тип записи</th>
        <th class="user-table__header-deposit">Логин</th>
        <th class="user-table__header-deposit">Пароль</th>
      </tr>
    </thead>
    <tbody v-if="tableIsAvailable">
      <VTableRow v-for="user in userStore.users" :key="user.id" :user="user" @on-update="onUpdate" @on-delete="userStore.deleteUser"/>
    </tbody>
    <tbody v-else>
     no data
    </tbody>
  </table>
</template>

<style lang="scss">
.user-table {
  width: 100%;
  &__caption {
    text-align: right;
    margin-bottom: 12px;
  }
  &__header-deposit {
    text-align: center;
  }
}
</style>
