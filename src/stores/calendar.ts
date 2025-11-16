import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Appointment, CalendarView } from '@/types'

export const useCalendarStore = defineStore('calendar', () => {
  const view = ref<CalendarView>({
    mode: 'week',
    selectedDate: new Date(),
  })

  const selectedSalonId = ref<string | undefined>()
  const selectedMasterIds = ref<string[]>([])
  const selectedStatuses = ref<Appointment['status'][]>([])
  const appointments = ref<Appointment[]>([])
  const loading = ref(false)

  const filteredAppointments = computed(() => {
    return appointments.value.filter((appointment) => {
      if (selectedSalonId.value && appointment.salonId !== selectedSalonId.value) {
        return false
      }

      if (
        selectedMasterIds.value.length > 0 &&
        !selectedMasterIds.value.includes(appointment.masterId)
      ) {
        return false
      }

      if (
        selectedStatuses.value.length > 0 &&
        !selectedStatuses.value.includes(appointment.status)
      ) {
        return false
      }

      return true
    })
  })

  const setView = (newView: Partial<CalendarView>) => {
    view.value = { ...view.value, ...newView }
  }

  const selectSalon = (salonId: string | undefined) => {
    selectedSalonId.value = salonId
  }

  const toggleMaster = (masterId: string) => {
    const index = selectedMasterIds.value.indexOf(masterId)
    if (index > -1) {
      selectedMasterIds.value.splice(index, 1)
    } else {
      selectedMasterIds.value.push(masterId)
    }
  }

  const setMasters = (masterIds: string[]) => {
    selectedMasterIds.value = masterIds
  }

  const toggleStatus = (status: Appointment['status']) => {
    const index = selectedStatuses.value.indexOf(status)
    if (index > -1) {
      selectedStatuses.value.splice(index, 1)
    } else {
      selectedStatuses.value.push(status)
    }
  }

  const setStatuses = (statuses: Appointment['status'][]) => {
    selectedStatuses.value = statuses
  }

  const clearFilters = () => {
    selectedMasterIds.value = []
    selectedStatuses.value = []
  }

  const addAppointment = (appointment: Appointment) => {
    appointments.value.push(appointment)
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const index = appointments.value.findIndex((a) => a.id === id)
    if (index > -1) {
      appointments.value[index] = { ...appointments.value[index], ...updates } as Appointment
    }
  }

  const removeAppointment = (id: string) => {
    const index = appointments.value.findIndex((a) => a.id === id)
    if (index > -1) {
      appointments.value.splice(index, 1)
    }
  }

  const setAppointments = (newAppointments: Appointment[]) => {
    appointments.value = newAppointments
  }

  return {
    view,
    selectedSalonId,
    selectedMasterIds,
    selectedStatuses,
    appointments,
    loading,
    filteredAppointments,
    setView,
    selectSalon,
    toggleMaster,
    setMasters,
    toggleStatus,
    setStatuses,
    clearFilters,
    addAppointment,
    updateAppointment,
    removeAppointment,
    setAppointments,
  }
})
