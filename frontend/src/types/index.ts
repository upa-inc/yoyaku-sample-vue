export interface Reservation {
  id?: string;
  title: string;
  date: string;
  description: string;
  roomNumber: string;
  roomId: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
} 