"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { BarberShop } from "@prisma/client";
import { SheetContent, SheetTrigger, Sheet } from "@/components/ui/sheet";
import SideMenu from "@/components/side-menu";
import Link from "next/link";

interface BarberShopInfoProps {
  barbershop: BarberShop;
}

const BarberShopInfo = ({ barbershop }: BarberShopInfoProps) => {
  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{ objectFit: "cover" }}
          className="opacity-75"
        />

        <Button
          size={"icon"}
          variant="outline"
          className="z-50 top-4 left-4 absolute"
          asChild
        >
          <Link href="/" replace={true}>
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute z-50 top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0 px-5">
            <SideMenu />
          </SheetContent>
        </Sheet>
      </div>

      <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold py-3">{barbershop.name}</h1>

        <div className="flex gap-2 items-center mt-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm ">{barbershop.address}</p>
        </div>

        <div className="flex gap-2 items-center mt-2">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm ">5,0 (899 avaliações)</p>
        </div>
      </div>
    </div>
  );
};

export default BarberShopInfo;
