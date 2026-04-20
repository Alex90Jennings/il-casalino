export const ROOMS = ["Stella", "Luna", "Venere", "Marte"] as const;
export type Room = (typeof ROOMS)[number];

export interface RoomInfo {
  name: Room;
  slug: string;
  descriptionIt: string;
  descriptionEn: string;
  maxGuests: number;
  images: string[];
}
