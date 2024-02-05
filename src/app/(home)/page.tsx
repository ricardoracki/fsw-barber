import Header from "@/components/header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import { db } from "@/prisma";
import BarberShopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import BookingItem from "@/components/booking-item";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, bookings] = await Promise.all([
    db.barberShop.findMany(),
    session?.user
      ? await db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barberShop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="pb-3">
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          Olá,{" "}
          {session?.user?.name?.split(" ")[0] || "vamos agendar um corte hoje?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE', 'dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      {bookings.length > 0 && (
        <div className=" mt-6">
          <h2 className="pl-5 text-xs uppercase text-gray-400 mb-3 font-bold">
            Agendamentos
          </h2>
          <div className="px-5 flex flex-row gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {bookings.map((booking) => (
              <div key={booking.id} className="min-w-full max-w-full">
                <BookingItem booking={booking} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xs uppercase text-gray-400 mb-3 font-bold px-5">
          Recomendados
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarberShopItem barberShop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xs uppercase text-gray-400 mb-3 font-bold px-5">
          Populares
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarberShopItem barberShop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
