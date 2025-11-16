import * as yup from 'yup'

export const emailValidator = yup.string().email('validation.email.invalid').required('validation.email.required')

export const emailOptionalValidator = yup.string().email('validation.email.invalid').nullable()

export const passwordValidator = yup
  .string()
  .min(6, 'validation.password.minLength')
  .required('validation.password.required')

export const phoneValidator = yup
  .string()
  .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'validation.phone.invalid')
  .required('validation.phone.required')

export const phoneOptionalValidator = yup
  .string()
  .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'validation.phone.invalid')
  .nullable()

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

export const appointmentSchema = yup.object({
  clientId: yup.string().required('validation.client.required'),
  masterId: yup.string().required('validation.master.required'),
  serviceId: yup.string().required('validation.service.required'),
  salonId: yup.string().nullable(),
  date: yup.date().required('validation.date.required'),
  startTime: timeValidator,
  status: yup.string().oneOf(['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show']).required('validation.status.required'),
  notes: yup.string().nullable(),
})

export const masterSchema = yup.object({
  firstName: nameValidator,
  lastName: nameValidator,
  email: emailValidator,
  phone: phoneValidator,
  specialization: yup.string().required('validation.specialization.required'),
  status: yup.string().oneOf(['active', 'inactive']).required('validation.status.required'),
  salonId: yup.string().nullable(),
})

export const salonSchema = yup.object({
  name: yup.string().min(2, 'validation.name.minLength').max(100, 'validation.name.maxLength').required('validation.name.required'),
  address: yup.string().min(5, 'validation.address.minLength').required('validation.address.required'),
  phone: phoneValidator,
  email: emailOptionalValidator,
  workingHours: yup.string().nullable(),
})

export const clientSchema = yup.object({
  firstName: nameValidator,
  lastName: nameValidator,
  email: emailOptionalValidator,
  phone: phoneValidator,
  notes: yup.string().nullable(),
})
