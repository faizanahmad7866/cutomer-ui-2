export type HallCategory = "banquet" | "wedding_hall" | "lawn";
export type FoodType = "veg" | "nonveg" | "both";
export type SlotType = "morning" | "night";
export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled" | "completed";

export interface Hall {
  id: string;
  name: string;
  category: HallCategory;
  foodType: FoodType;
  city: string;
  area: string;
  address: string;
  rating: number;
  totalReviews: number;
  capacity: number;
  priceMorning: number;
  priceNight: number;
  images: string[];
  amenities: string[];
  description: string;
  ownerName: string;
  ownerPhone: string;
  isVerified: boolean;
  distanceKm?: number;
  bookedDates: Record<string, SlotType[]>; // "2026-05-12": ["morning"]
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  photo?: string;
}

export interface Booking {
  id: string;            // BMH-XXXXXX
  hallId: string;
  hallName: string;
  hallImage: string;
  hallAddress: string;
  ownerName: string;
  ownerPhone: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;          // ISO date
  slot: SlotType;
  guestCount: number;
  functionType: string;
  foodPreference: "veg" | "nonveg";
  totalAmount: number;
  paidAmount: number;    // 5%
  pendingAmount: number; // 95%
  status: BookingStatus;
  createdAt: string;
  rated?: boolean;
  rating?: number;
  reviewText?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "owner" | "system";
  createdAt: string;
  read: boolean;
  link?: string;
}