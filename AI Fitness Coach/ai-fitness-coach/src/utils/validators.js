/**
 * Валидаторы для форм
 */

// Основные валидаторы
export const validators = {
  // Обязательное поле
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim() !== ''
    }
    return value !== undefined && value !== null && value !== ''
  },
  
  // Минимальная длина
  minLength: (value, length) => {
    if (typeof value === 'string') {
      return value.length >= length
    }
    return true
  },
  
  // Максимальная длина
  maxLength: (value, length) => {
    if (typeof value === 'string') {
      return value.length <= length
    }
    return true
  },
  
  // Email валидация
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  // Минимальное значение
  min: (value, min) => {
    const num = Number(value)
    return !isNaN(num) && num >= min
  },
  
  // Максимальное значение
  max: (value, max) => {
    const num = Number(value)
    return !isNaN(num) && num <= max
  },
  
  // Только числа
  numeric: (value) => {
    return !isNaN(Number(value))
  },
  
  // URL валидация
  url: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  
  // Пароль (минимум 6 символов, одна буква, одна цифра)
  password: (value) => {
    if (value.length < 6) return false
    const hasLetter = /[a-zA-Z]/.test(value)
    const hasNumber = /\d/.test(value)
    return hasLetter && hasNumber
  },
  
  // Совпадение полей
  match: (value, fieldValue) => {
    return value === fieldValue
  },
  
  // Валидация диапазона
  range: (value, min, max) => {
    const num = Number(value)
    return !isNaN(num) && num >= min && num <= max
  },
  
  // Только буквы
  alpha: (value) => {
    return /^[a-zA-Zа-яА-Я\s]+$/.test(value)
  },
  
  // Буквы и цифры
  alphanumeric: (value) => {
    return /^[a-zA-Zа-яА-Я0-9\s]+$/.test(value)
  },
  
  // Телефон (базовая проверка)
  phone: (value) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/
    return phoneRegex.test(value.replace(/\s/g, ''))
  }
}

// Функция для валидации формы
export const validateForm = (formData, rules) => {
  const errors = {}
  let isValid = true
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = formData[field]
    
    for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
      const validator = validators[ruleName]
      
      if (!validator) continue
      
      const ruleResult = typeof ruleValue === 'boolean' 
        ? validator(value)
        : validator(value, ruleValue)
      
      if (!ruleResult) {
        errors[field] = getErrorMessage(ruleName, ruleValue, field)
        isValid = false
        break
      }
    }
  })
  
  return { isValid, errors }
}

// Функция для валидации одного поля
export const validateField = (fieldName, value, rules) => {
  if (!rules[fieldName]) return null
  
  const fieldRules = rules[fieldName]
  
  for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
    const validator = validators[ruleName]
    
    if (!validator) continue
    
    const ruleResult = typeof ruleValue === 'boolean' 
      ? validator(value)
      : validator(value, ruleValue)
    
    if (!ruleResult) {
      return getErrorMessage(ruleName, ruleValue, fieldName)
    }
  }
  
  return null
}

// Получение сообщений об ошибках
export const getErrorMessage = (ruleName, ruleValue, fieldName) => {
  // Локализованные названия полей
  const fieldNames = {
    name: 'Имя',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    title: 'Название',
    description: 'Описание',
    duration: 'Длительность',
    calories: 'Калории',
    weight: 'Вес',
    height: 'Рост',
    age: 'Возраст',
    phone: 'Телефон',
    address: 'Адрес'
  }
  
  const fieldLabel = fieldNames[fieldName] || fieldName
  
  // Сообщения об ошибках
  const messages = {
    required: `${fieldLabel} обязательно для заполнения`,
    email: 'Введите корректный email адрес',
    minLength: `Минимальная длина: ${ruleValue} символов`,
    maxLength: `Максимальная длина: ${ruleValue} символов`,
    min: `Минимальное значение: ${ruleValue}`,
    max: `Максимальное значение: ${ruleValue}`,
    numeric: 'Должно быть числом',
    url: 'Введите корректный URL',
    password: 'Пароль должен содержать минимум 6 символов, включая буквы и цифры',
    match: 'Поля не совпадают',
    range: `Значение должно быть от ${ruleValue[0]} до ${ruleValue[1]}`,
    alpha: 'Допускаются только буквы',
    alphanumeric: 'Допускаются только буквы и цифры',
    phone: 'Введите корректный номер телефона'
  }
  
  return messages[ruleName] || `Ошибка валидации: ${ruleName}`
}

// Предустановленные наборы правил
export const validationRules = {
  // Регистрация пользователя
  register: {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: { required: true, match: true }
  },
  
  // Вход
  login: {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 }
  },
  
  // Профиль пользователя
  profile: {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, email: true },
    weight: { required: true, numeric: true, min: 30, max: 200 },
    height: { required: true, numeric: true, min: 100, max: 250 },
    age: { required: true, numeric: true, min: 12, max: 100 }
  },
  
  // Тренировка
  workout: {
    title: { required: true, minLength: 3, maxLength: 100 },
    description: { maxLength: 500 },
    duration: { required: true, numeric: true, min: 5, max: 180 },
    calories: { numeric: true, min: 0, max: 1000 }
  },
  
  // Питание
  nutrition: {
    name: { required: true, minLength: 2, maxLength: 100 },
    calories: { required: true, numeric: true, min: 0, max: 2000 },
    protein: { numeric: true, min: 0, max: 200 },
    carbs: { numeric: true, min: 0, max: 500 },
    fat: { numeric: true, min: 0, max: 200 }
  }
}

// Хелпер для создания динамических правил
export const createRules = (fieldConfigs) => {
  const rules = {}
  
  fieldConfigs.forEach(config => {
    rules[config.name] = {}
    
    if (config.required) {
      rules[config.name].required = true
    }
    
    if (config.minLength) {
      rules[config.name].minLength = config.minLength
    }
    
    if (config.maxLength) {
      rules[config.name].maxLength = config.maxLength
    }
    
    if (config.min) {
      rules[config.name].min = config.min
    }
    
    if (config.max) {
      rules[config.name].max = config.max
    }
    
    if (config.type === 'email') {
      rules[config.name].email = true
    }
    
    if (config.type === 'numeric') {
      rules[config.name].numeric = true
    }
    
    if (config.type === 'url') {
      rules[config.name].url = true
    }
    
    if (config.type === 'password') {
      rules[config.name].password = true
    }
  })
  
  return rules
}

// Декоратор валидации для функций
export const withValidation = (rules) => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value
    
    descriptor.value = function(...args) {
      const formData = args[0] || {}
      const { isValid, errors } = validateForm(formData, rules)
      
      if (!isValid) {
        return Promise.reject({ 
          success: false, 
          errors, 
          message: 'Ошибка валидации формы' 
        })
      }
      
      return originalMethod.apply(this, args)
    }
    
    return descriptor
  }
}