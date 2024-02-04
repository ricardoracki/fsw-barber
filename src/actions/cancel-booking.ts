"use server";

import { db } from "@/prisma";
import { revalidatePath } from "next/cache";

export const cancelBooking = async (bookingId: string) => {
  await db.booking.delete({
    where: {
      id: bookingId,
    },
  });

  revalidatePath("/bookings");
};
