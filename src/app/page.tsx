"use client";
import { Card, CardContent } from "@/components/ui/card";
import { listAll } from "@/service/ads";
import { AdData } from "@/service/types";
import React from "react";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
dayjs.extend(localizedFormat);

export default function Home() {
  const [ads, setAds] = React.useState<AdData[]>([]);
  React.useEffect(() => {
    listAll().then((data) => {
      setAds(data);
    });
  }, []);

  return (
    <main className="flex flex-col w-11/12 mx-auto gap-4 sm:w-[370px]">
      <p className="text-center text-2xl font-bold mt-8">Даты для рекламы</p>
      {ads[0] ? (
        ads.map((item, i) => (
          <Card
            className="flex justify-between items-center pr-4"
            key={item.id}
          >
            <CardContent className="flex  gap-4 pt-5 items-center">
              <p className="text-lg font-bold">
                {dayjs(item.date)
                  .format("LL")
                  .replace("2023 г.", "")
                  .replace("2024 г.", "")}
              </p>
            </CardContent>
            <p className="p-2 h-auto">
              {item.open ? "✅ Открыта" : "❌ Закрыта"}
            </p>
          </Card>
        ))
      ) : (
        <p className="text-center font-semibold">Нет дат для рекламы</p>
      )}
    </main>
  );
}
