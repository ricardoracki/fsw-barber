import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const BookingItem = () => {
  return (
    <Card>
      <CardContent className="px-5 py-0 flex justify-between">
        <div className="flex flex-col gap-2 py-5">
          <Badge className="bg-[#221c3d] text-primary hover:bg-[#221c3d] w-fit">
            Confirmado
          </Badge>

          <h2 className="font-bold">Corte de Cabelo</h2>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h3 className="text-sm">Vintage Barber</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-solid border-secondary px-3">
          <p className="text-sm">Fevereiro</p>
          <div className="text-2xl">06</div>
          <div className="text-sm">09:45</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;
