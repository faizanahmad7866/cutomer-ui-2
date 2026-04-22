import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Booking, AppNotification, User, SlotType } from "@/types";
import { HALLS } from "@/data/halls";

interface AppState {
  user: User | null;
  isAuthed: boolean;
  city: string;
  bookings: Booking[];
  notifications: AppNotification[];

  setCity: (city: string) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;

  addBooking: (b: Booking) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  addReview: (id: string, rating: number, text: string) => void;

  markAllNotificationsRead: () => void;
  pushNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;

  unreadCount: () => number;
}

const seedNotifications: AppNotification[] = [
  { id: "n1", title: "Welcome to BookMyHall 🎉", message: "Browse top halls in your city and book with just 5% advance.", type: "system", createdAt: new Date().toISOString(), read: false },
];

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthed: false,
      city: "Mumbai",
      bookings: [],
      notifications: seedNotifications,

      setCity: (city) => set({ city }),
      login: (user) => set({ user, isAuthed: true }),
      logout: () => set({ user: null, isAuthed: false }),
      updateUser: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),

      addBooking: (b) => set((s) => ({
        bookings: [b, ...s.bookings],
        notifications: [
          { id: `n-${Date.now()}`, title: "Booking placed", message: `Your booking ${b.id} for ${b.hallName} is pending owner confirmation.`, type: "booking", createdAt: new Date().toISOString(), read: false, link: `/bookings/${b.id}` },
          ...s.notifications,
        ],
      })),
      updateBookingStatus: (id, status) => set((s) => ({
        bookings: s.bookings.map((b) => b.id === id ? { ...b, status } : b),
      })),
      addReview: (id, rating, text) => set((s) => ({
        bookings: s.bookings.map((b) => b.id === id ? { ...b, rated: true, rating, reviewText: text } : b),
      })),

      markAllNotificationsRead: () => set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),
      pushNotification: (n) => set((s) => ({
        notifications: [{ id: `n-${Date.now()}`, createdAt: new Date().toISOString(), read: false, ...n }, ...s.notifications],
      })),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "bookmyhall-store" }
  )
);

// Helper: combine static + user bookings to determine hall availability
export function getHallBookedSlots(hallId: string, dateISO: string): SlotType[] {
  const hall = HALLS.find((h) => h.id === hallId);
  const seeded = (hall?.bookedDates[dateISO] ?? []) as SlotType[];
  const userBooked = useApp.getState().bookings
    .filter((b) => b.hallId === hallId && b.date === dateISO && (b.status === "pending" || b.status === "confirmed"))
    .map((b) => b.slot);
  return Array.from(new Set([...seeded, ...userBooked]));
}