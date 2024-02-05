"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarberShop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarberShopProps {
  barberShop: BarberShop;
}

const BarberShopItem = ({ barberShop }: BarberShopProps) => {
  const router = useRouter();

  const handleBookingClick = () => {
    router.push(`/barbershops/${barberShop.id}`);
  };

  return (
    <Card className="min-w-full max-w-full rounded-2xl">
      <CardContent className="px-1 pt-1 pb-0">
        <div className="relative w-full h-[159px]">
          <div className="absolute top-2 left-2 z-50">
            <Badge
              className="flex items-center gap-1 opacity-90"
              variant={"secondary"}
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>

          <Image
            alt={barberShop.name}
            src={barberShop.imageUrl}
            height={0}
            width={0}
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            className="h-[159px] w-full rounded-2xl"
          />
        </div>
        <div className="px-3 pb-3">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">
            {barberShop.name}
          </h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">
            {barberShop.address}
          </p>
          <Button
            className="w-full mt-3"
            variant={"secondary"}
            onClick={handleBookingClick}
          >
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberShopItem;
