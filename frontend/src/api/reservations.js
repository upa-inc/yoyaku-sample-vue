import apiClient from './client';

export default {
  // 予約の一覧を取得
  getReservations() {
    return apiClient.get('/reservations');
  },
  
  // 特定の予約を取得
  getReservation(id) {
    return apiClient.get(`/reservations/${id}`);
  },
  
  // 新規予約を作成
  createReservation(reservation) {
    return apiClient.post('/reservations', reservation);
  },
  
  // 予約を更新
  updateReservation(id, reservation) {
    return apiClient.put(`/reservations/${id}`, reservation);
  },
  
  // 予約をキャンセル（削除）
  deleteReservation(id) {
    return apiClient.delete(`/reservations/${id}`);
  }
}; 