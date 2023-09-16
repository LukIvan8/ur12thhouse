"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ru } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { create, flipOpen, listAll, remove } from "@/service/ads";
import { AdData } from "@/service/types";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
dayjs.extend(localizedFormat);

function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal ",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 " />
          {date ? format(date, "PPP") : <span>Выбери дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 ">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={ru}
        />
      </PopoverContent>
    </Popover>
  );
}

export function SwitchDemo({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        value={open ? "on" : "off"}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        id="open"
      />
      <Label htmlFor="open">Открыта</Label>
    </div>
  );
}

function AdminCard({
  date,
  id,
  open,
  updateAds,
}: {
  id: string;
  date: string;
  open: boolean;
  updateAds: React.Dispatch<React.SetStateAction<AdData[]>>;
}) {
  return (
    <Card className="flex justify-between items-center ">
      <CardContent className="flex flex-col gap-4 pt-5">
        <p className="text-lg font-bold">
          {dayjs(date)
            .format("LL")
            .replace("2023 г.", "")
            .replace("2024 г.", "")}
        </p>
        <Button
          onClick={(e) => {
            e.currentTarget.disabled = true;
            flipOpen(id).then(() => {
              listAll().then((data) => {
                updateAds(data);
              });
            });
            e.currentTarget.disabled = false;
          }}
          className="p-2 h-auto"
          variant="outline"
        >
          {open ? "✅ Открыта" : "❌ Закрыта"}
        </Button>
      </CardContent>
      <CardContent className="flex flex-col gap-4 pt-5 items-end">
        <Button
          onClick={(e) => {
            e.currentTarget.disabled = true;
            remove(id)
              .then(() => {
                listAll().then((data) => {
                  updateAds(data);
                });
              })
              .catch(() => {
                e.currentTarget.disabled = false;
              });
          }}
          variant="destructive"
          className="p-2 h-auto"
        >
          Удалить
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [ads, setAds] = React.useState<AdData[]>([]);

  React.useEffect(() => {
    listAll().then((data) => {
      setAds(data);
    });
  }, []);

  return (
    <div className="sm:w-[640px] mx-auto flex flex-col items-center mt-4 gap-5">
      <p className="font-bold text-xl">Добавить слот</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (date)
            create(dayjs(date).toISOString().replace("T", " "), open).then(
              () => {
                listAll().then((data) => {
                  setAds(data);
                });
              }
            );
        }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <DatePicker date={date} setDate={setDate} />
        <SwitchDemo open={open} setOpen={setOpen} />
        <Button type="submit">Добавить</Button>
      </form>
      <Separator />
      <div className="flex flex-col gap-4 items-stretch w-11/12">
        {ads &&
          ads.map((item, i) => (
            <AdminCard
              date={item.date}
              id={item.id}
              open={item.open}
              key={item.id}
              updateAds={setAds}
            />
          ))}
      </div>
    </div>
  );
}
