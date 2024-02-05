import Header from "@/components/header";
import { db } from "@/prisma";
import BarberShopItem from "../(home)/_components/barbershop-item";
import { redirect } from "next/navigation";
import Search from "../(home)/_components/search";

interface BarberShopsPageProps {
  searchParams: {
    search?: string;
  };
}

const BarberShopPage = async ({ searchParams }: BarberShopsPageProps) => {
  if (!searchParams.search) return redirect("/");

  const barberShops = await db.barberShop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <Header />
      <div className="px-5 py-6 flex flex-col gap-6">
        <Search defaultValues={{ search: searchParams.search }} />
        <div className="px-5 py-6">
          <h1 className="text-gray-400 font-bold text-xs uppercase">
            Resultados para &quot;{searchParams.search}&quot;
          </h1>

          <div className="grid grid-cols-2 gap-4">
            {barberShops.map((barbershop) => (
              <div key={barbershop.id} className="w-full">
                <BarberShopItem barberShop={barbershop} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BarberShopPage;
