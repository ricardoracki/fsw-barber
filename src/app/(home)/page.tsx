import Header from "@/components/header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import { db } from "@/prisma";
import BarberShopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {
  const barbershops = await db.barberShop.findMany();

  const session = await getServerSession(authOptions);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user?.name?.split(" ")[0] || "Seja bem vindo"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE', 'dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-xs uppercase text-gray-400 mb-3 font-bold">
          Agendamentos
        </h2>
        {/* <BookingItem /> */}
      </div>

      <div className="mt-6">
        <h2 className="text-xs uppercase text-gray-400 mb-3 font-bold px-5">
          Recomendados
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarberShopItem key={barbershop.id} barberShop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xs uppercase text-gray-400 mb-3 font-bold px-5">
          Populares
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarberShopItem key={barbershop.id} barberShop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
