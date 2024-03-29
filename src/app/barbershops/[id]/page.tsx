import { db } from "@/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface BarberShopDetaylsPageProps {
  params: {
    id?: string;
  };
}

const BarberShopDetailsPage = async ({
  params,
}: BarberShopDetaylsPageProps) => {
  if (!params.id) {
    // TODO: redirecionar para home page
    return null;
  }

  const session = await getServerSession(authOptions);

  const barbershop = await db.barberShop.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!barbershop) {
    // TODO: redirecionar para home page
    return null;
  }

  return (
    <div>
      <BarberShopInfo barbershop={barbershop} />
      <div className="p-5 gap-4 flex flex-col pt-6">
        {barbershop.services.map((service) => (
          <ServiceItem
            key={service.id}
            barbershop={barbershop}
            service={service}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
};

export default BarberShopDetailsPage;
