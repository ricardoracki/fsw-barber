"use server";
import { db } from "@/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (date: Date, barberShopId: string) => {
  const bookings = await db.booking.findMany({
    where: {
      barberShopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });

  return bookings;
};
