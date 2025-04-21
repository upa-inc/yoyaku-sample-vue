import { defineStore } from 'pinia'
import { ref } from 'vue'
import reservationService from '../api/reservations'
import { Reservation } from '../types'

export const useReservationStore = defineStore('reservations', () => {
  const reservations = ref<Reservation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReservations = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await reservationService.getReservations()
      reservations.value = response.data
    } catch (err) {
      console.error('予約の取得に失敗しました:', err)
      error.value = '予約データの読み込みに失敗しました。しばらくしてから再度お試しください。'
    } finally {
      loading.value = false
    }
  }

  const getReservation = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await reservationService.getReservation(id)
      return response.data
    } catch (err) {
      console.error('予約の詳細取得に失敗しました:', err)
      error.value = '予約の詳細情報の読み込みに失敗しました。'
      return null
    } finally {
      loading.value = false
    }
  }

  const createReservation = async (reservation: Omit<Reservation, 'id'>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await reservationService.createReservation(reservation)
      await fetchReservations() // 予約リストを更新
      return response.data
    } catch (err) {
      console.error('予約の作成に失敗しました:', err)
      error.value = '予約の作成に失敗しました。入力内容を確認して再度お試しください。'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateReservation = async (id: string, reservation: Omit<Reservation, 'id'>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await reservationService.updateReservation(id, reservation)
      await fetchReservations() // 予約リストを更新
      return response.data
    } catch (err) {
      console.error('予約の更新に失敗しました:', err)
      error.value = '予約の更新に失敗しました。入力内容を確認して再度お試しください。'
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteReservation = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await reservationService.deleteReservation(id)
      await fetchReservations() // 予約リストを更新
      return true
    } catch (err) {
      console.error('予約の削除に失敗しました:', err)
      error.value = '予約の削除に失敗しました。しばらくしてから再度お試しください。'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation
  }
}) 