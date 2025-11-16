import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import type { CalendarView } from '@/types'

export function useCalendar() {
  const calendarStore = useCalendarStore()

  const view = computed(() => calendarStore.view)
  const appointments = computed(() => calendarStore.filteredAppointments)
  const selectedSalonId = computed(() => calendarStore.selectedSalonId)
  const selectedMasterIds = computed(() => calendarStore.selectedMasterIds)

  const setView = (newView: Partial<CalendarView>) => {
    calendarStore.setView(newView)
  }

  const selectSalon = (salonId: string | undefined) => {
    calendarStore.selectSalon(salonId)
  }

  const toggleMaster = (masterId: string) => {
    calendarStore.toggleMaster(masterId)
  }

  return {
    view,
    appointments,
    selectedSalonId,
    selectedMasterIds,
    setView,
    selectSalon,
    toggleMaster,
  }
}
