"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BarberShop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { currencyFormat } from "../_helpers/currency";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";

interface ServiceItemProps {
  service: Service;
  barbershop: BarberShop;
  isAuthenticated?: boolean;
}

const ServiceItem = ({
  service,
  barbershop,
  isAuthenticated,
}: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<String | undefined>(undefined);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookins] = useState<Booking[]>([]);

  const { data } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!date) return;

    const refreshAvailableHoursa = async () => {
      const _dayBookings = await getDayBookings(date, barbershop.id);
      setDayBookins(_dayBookings);
    };

    refreshAvailableHoursa();
  }, [date, barbershop.id]);

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }

    // TODO abrir modal de agendamentos
  };

  const handleHourClick = (h: String) => {
    setHour(h);
  };

  const handleDateClick = (d: Date | undefined) => {
    setDate(d);
    setHour(undefined);
  };

  const handleBookingSubmit = async () => {
    try {
      if (!hour || !date || !data?.user) return;
      setSubmitIsLoading(true);
      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);

      setHour(undefined);
      setDate(undefined);

      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
    } finally {
      setSubmitIsLoading(false);
    }
  };

  const timeList = useMemo(() => {
    return date
      ? generateDayTimeList(date).filter((time) => {
          const hours = Number(time.split(":")[0]);
          const minutes = Number(time.split(":")[1]);

          const booking = dayBookings.find((booking) => {
            const bookingHour = booking.date.getHours();
            const bookingMinutes = booking.date.getMinutes();

            return bookingHour == hours && bookingMinutes == minutes;
          });

          return !booking;
        })
      : [];
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-2 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              style={{ objectFit: "cover" }}
              alt={service.name}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">{`${currencyFormat(
                Number(service.price)
              )}`}</p>

              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleButtonClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {date && (
                    <div className="flex overflow-x-auto gap-3 [&::-webkit-scrollbar]:hidden py-6 px-5 border-t border-solid border-secondary">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleHourClick(time)}
                          key={`${time}`}
                          variant={hour == time ? "default" : "outline"}
                          className="rounded-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 gap-3 flex flex-col">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">{`${currencyFormat(
                            Number(service.price)
                          )}`}</h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data:</h3>
                            <h4 className="text-sm">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Hora:</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia:</h3>
                          <h4 className="text-sm">{barbershop.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className="px-5">
                    <Button
                      disabled={!hour || !date || submitIsLoading}
                      onClick={handleBookingSubmit}
                    >
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {submitIsLoading ? "Salvando" : "Confirmar Reserva"}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
