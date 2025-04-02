import apiClient from './client';
import { Reservation, ApiResponse } from '../types';
import { AxiosResponse } from 'axios';

export default {
  // 予約の一覧を取得
  getReservations(): Promise<AxiosResponse<Reservation[]>> {
    return apiClient.get('/reservations');
  },
  
  // 特定の予約を取得
  getReservation(id: string): Promise<AxiosResponse<Reservation>> {
    return apiClient.get(`/reservations/${id}`);
  },
  
  // 新規予約を作成
  createReservation(reservation: Reservation): Promise<AxiosResponse<Reservation>> {
    return apiClient.post('/reservations', reservation);
  },
  
  // 予約を更新
  updateReservation(id: string, reservation: Reservation): Promise<AxiosResponse<Reservation>> {
    return apiClient.put(`/reservations/${id}`, reservation);
  },
  
  // 予約をキャンセル（削除）
  deleteReservation(id: string): Promise<AxiosResponse<void>> {
    return apiClient.delete(`/reservations/${id}`);
  }
}; 