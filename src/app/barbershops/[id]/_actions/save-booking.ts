"use server";

import { db } from "@/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingParams {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export const saveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      barberShopId: params.barbershopId,
      date: params.date,
      userId: params.userId,
      status: "Confirmado",
    },
  });

  revalidatePath("/bookings");
  revalidatePath("/");
};
