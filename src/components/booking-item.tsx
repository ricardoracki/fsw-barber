import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barberShop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const finished = isPast(booking.date);
  return (
    <Card className="min-w-full">
      <CardContent className="px-0 py-0 flex">
        <div className="flex flex-col gap-2 py-5 pl-5 flex-[3]">
          <Badge variant={finished ? "secondary" : "default"} className="w-fit">
            {finished ? "Finalizado" : "Confirmado"}
          </Badge>

          <h2 className="font-bold">{booking.service.name}</h2>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={booking.barberShop.imageUrl} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h3 className="text-sm">{booking.barberShop.name}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-solid border-secondary flex-1">
          <p className="text-sm capitalize">
            {format(booking.date, "MMMM", { locale: ptBR })}
          </p>
          <p className="text-2xl">
            {format(booking.date, "dd", { locale: ptBR })}
          </p>
          <p className="text-sm">
            {format(booking.date, "hh:mm", { locale: ptBR })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;
