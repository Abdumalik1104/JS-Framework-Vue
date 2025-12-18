import { reactive, computed } from 'vue'

export function useFormValidation(form, rules) {
  const errors = reactive({})
  const touched = reactive({})
  
  // Валидаторы
  const validators = {
    required: (value) => {
      if (typeof value === 'string') {
        return value.trim() !== ''
      }
      return value !== undefined && value !== null
    },
    
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    
    minLength: (value, length) => {
      if (typeof value === 'string') {
        return value.length >= length
      }
      return true
    },
    
    maxLength: (value, length) => {
      if (typeof value === 'string') {
        return value.length <= length
      }
      return true
    },
    
    min: (value, min) => {
      const num = Number(value)
      return !isNaN(num) && num >= min
    },
    
    max: (value, max) => {
      const num = Number(value)
      return !isNaN(num) && num <= max
    },
    
    numeric: (value) => {
      return !isNaN(Number(value))
    },
    
    url: (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }
  }
  
  // Валидация одного поля
  const validateField = (fieldName) => {
    touched[fieldName] = true
    
    if (!rules[fieldName]) {
      delete errors[fieldName]
      return true
    }
    
    const fieldRules = rules[fieldName]
    const value = form[fieldName]
    
    for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
      const validator = validators[ruleName]
      
      if (!validator) continue
      
      const isValid = typeof ruleValue === 'boolean' 
        ? validator(value)
        : validator(value, ruleValue)
      
      if (!isValid) {
        errors[fieldName] = getErrorMessage(ruleName, ruleValue, fieldName)
        return false
      }
    }
    
    delete errors[fieldName]
    return true
  }
  
  // Валидация всей формы
  const validateForm = () => {
    let isValid = true
    
    Object.keys(rules).forEach(fieldName => {
      touched[fieldName] = true
      if (!validateField(fieldName)) {
        isValid = false
      }
    })
    
    return isValid
  }
  
  // Получение сообщения об ошибке
  const getErrorMessage = (ruleName, ruleValue, fieldName) => {
    const fieldNames = {
      name: 'Имя',
      email: 'Email',
      password: 'Пароль',
      title: 'Название',
      description: 'Описание',
      duration: 'Длительность',
      calories: 'Калории'
    }
    
    const fieldLabel = fieldNames[fieldName] || fieldName
    
    const messages = {
      required: `${fieldLabel} обязательно для заполнения`,
      email: 'Введите корректный email адрес',
      minLength: `Минимальная длина: ${ruleValue} символов`,
      maxLength: `Максимальная длина: ${ruleValue} символов`,
      min: `Минимальное значение: ${ruleValue}`,
      max: `Максимальное значение: ${ruleValue}`,
      numeric: 'Должно быть числом',
      url: 'Введите корректный URL'
    }
    
    return messages[ruleName] || `Ошибка валидации: ${ruleName}`
  }
  
  // Сброс валидации
  const resetValidation = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
  }
  
  // Computed свойства
  const isValid = computed(() => {
    return Object.keys(errors).length === 0
  })
  
  const isTouched = computed(() => {
    return Object.keys(touched).length > 0
  })
  
  const hasErrors = computed(() => {
    return Object.keys(errors).length > 0
  })
  
  return {
    errors,
    touched,
    isValid,
    isTouched,
    hasErrors,
    validateField,
    validateForm,
    resetValidation
  }
}