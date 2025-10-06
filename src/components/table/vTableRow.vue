<script lang="ts" setup>
import {InputText, Select, Password, Button} from 'primevue'
import {constEntityTypes, type iUser, type tEntityTypes} from '@/stores/user.ts'
import {ref, watch} from 'vue'

const props = defineProps(['user'])

const emits = defineEmits(['onDelete', 'onUpdate'])

const user: iUser = ref()
const separator = ';'

type tKey = 'marks' | 'type' | 'login' | 'password'
const freshValidation: {[key in tKey]: {status:boolean, error:string}} = {
  marks: {status: false, error: ''},
  type: {status: false, error: ''},
  login: {status: false, error: ''},
  password: {status: false, error: ''}
}
const rulesCollection = {
  marks: {
    required: () => false,
    minLength: null,
    maxLength: 50,
    pattern: '^(?!;)(?!.*;$)(?!.*;;)[\\s\\S]*$'
  },
  type: {
    required: () => true,
    minLength: null,
    maxLength: null,
    pattern: ''
  },
  login: {
    required: () => true,
    minLength: 3,
    maxLength: 100,
    pattern: ''
  },
  password: {
    required: () => user.value.type === 'Локальная',
    minLength: 3,
    maxLength: 100,
    pattern: ''
  }
}

const isValid = ref({...freshValidation})

const checkEntityType = (type: tEntityTypes) => {
  if (type === 'LDAP') {
    user.value.password = null
    passIsRequired.value = false
    isValid.value.password.status = true
  } else {
    if (!user.value.password) {
      user.value.password = ''
    }
    passIsRequired.value = true
    isValid.value.password.status = false
  }
}

const validate = (value: string, key: tKey) => {
  const rules = rulesCollection[key]
  const validated = {
    required: !rules.required() || !!value,
    pattern: !rules.pattern || !!value.match(rules.pattern),
    length: !(rules.minLength && rules.maxLength) || value?.length >= rules.minLength && value?.length <= rules.maxLength || !rules.required() && !value
  }
  
  isValid.value[key].status = validated.required && validated.pattern && validated.length
  
  const overallValidation = Object.values(isValid.value).reduce((result, {status}) => result && status, true)
  
  const updatedUser = JSON.parse(JSON.stringify(user.value))
  updatedUser.marks = user.value.marks.split(separator).map((textMark: string) => ({text: textMark}))
  
  if (overallValidation && JSON.stringify(updatedUser) !== JSON.stringify(props.user)) {
    emits('onUpdate', updatedUser)
  }
}

const passIsRequired = ref(true)

watch(() => props.user, (newValue, oldValue) => {
  if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return
  
  user.value = JSON.parse(JSON.stringify(newValue))
  user.value.marks = newValue.marks.reduce((accumulator: string, item: { text: string }) => `${accumulator}${item.text}${separator}`, '').slice(0, -1)
  
  checkEntityType(user.value.type)
  
  Object.keys(freshValidation).forEach((key: any) => {
    validate(user.value[key], key)
  })
}, {immediate: true, deep: true})
watch(() => user.value.type, (newValue) => {
  checkEntityType(newValue)
})

</script>

<template>
  <tr>
    <td>
      <InputText
        :invalid="!isValid.marks.status"
        v-model="user.marks"
        fluid
        width="20%"
        @blur="validate(user.marks, 'marks')"
      />
    </td>
    <td>
      <Select
        v-model="user.type"
        :invalid="!isValid.type.status"
        :options="constEntityTypes"
        fluid
        @blur="validate(user.type, 'type')"
      />
    </td>
    <td :colspan="passIsRequired ? 1 : 2">
      <InputText
        :invalid="!isValid.login.status"
        v-model="user.login"
        fluid
        placeholder="Введите логин"
        width="20%"
        @blur="validate(user.login, 'login')"
      />
    </td>
    <td v-if="passIsRequired">
      <Password
        v-model="user.password"
        :feedback="false"
        :invalid="!isValid.password.status"
        fluid
        placeholder="Введите пароль"
        width="20%"
        @blur="validate(user.password, 'password')"
      />
    </td>
    <td>
      <Button icon="pi pi-trash" severity="danger" @click="emits('onDelete', user)"/>
    </td>
  </tr>
</template>

<style scoped>

</style>
