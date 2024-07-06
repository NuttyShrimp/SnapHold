export type SerializedEvent = {
  id: number;
  name: string;
  startAt: string;
  endAt: string;
  photoLimit: number;
}

export type SerializedPhoto = {
  id: number;
  event_id: number;
  user_id: string;
  url: string;
  created_at: string;
}