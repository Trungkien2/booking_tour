"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartTraveler {
  fullName: string;
  ageGroup: "ADULT" | "CHILD" | "BABY";
  gender?: string;
}

export interface CartItem {
  id: string;
  tourId: number;
  tourName: string;
  tourSlug: string;
  coverImage: string;
  scheduleId: number;
  startDate: string;
  travelers: CartTraveler[];
  pricePerAdult: number;
  pricePerChild: number;
  itemTotal: number;
  addedAt: string;
}

const SERVICE_FEE = 15;

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  updateTravelers: (id: string, travelers: CartTraveler[]) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.tourId === item.tourId && i.scheduleId === item.scheduleId,
        );
        if (existing) {
          // Update travelers for existing item
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id
                ? { ...i, travelers: item.travelers, itemTotal: item.itemTotal }
                : i,
            ),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              { ...item, id: generateId(), addedAt: new Date().toISOString() },
            ],
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateTravelers: (id, travelers) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== id) return i;
            const adultCount = travelers.filter(
              (t) => t.ageGroup === "ADULT",
            ).length;
            const childCount = travelers.filter(
              (t) => t.ageGroup === "CHILD",
            ).length;
            const itemTotal =
              adultCount * i.pricePerAdult + childCount * i.pricePerChild;
            return { ...i, travelers, itemTotal };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.length,

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.itemTotal, 0),

      getServiceFee: () => (get().items.length > 0 ? SERVICE_FEE : 0),

      getTotal: () => {
        const state = get();
        const subtotal = state.items.reduce(
          (sum, item) => sum + item.itemTotal,
          0,
        );
        return subtotal + (state.items.length > 0 ? SERVICE_FEE : 0);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
