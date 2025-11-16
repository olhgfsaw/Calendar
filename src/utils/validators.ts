import * as yup from 'yup'

export const emailValidator = yup.string().email('validation.email.invalid').required('validation.email.required')

export const passwordValidator = yup
  .string()
  .min(6, 'validation.password.minLength')
  .required('validation.password.required')

export const phoneValidator = yup
  .string()
  .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'validation.phone.invalid')
  .required('validation.phone.required')

export const requiredValidator = (fieldName: string) =>
  yup.string().required(`validation.${fieldName}.required`)

export const nameValidator = yup
  .string()
  .min(2, 'validation.name.minLength')
  .max(50, 'validation.name.maxLength')
  .required('validation.name.required')

export const timeValidator = yup
  .string()
  .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'validation.time.invalid')
  .required('validation.time.required')

export const dateValidator = yup.date().required('validation.date.required')
