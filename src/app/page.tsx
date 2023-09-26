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
  const [ads, setAds] = React.useState<AdData[] | undefined>();
  React.useEffect(() => {
    listAll().then((data) => {
      setAds(data);
    });
  }, []);

  return (
    <main className="flex flex-col w-11/12 mx-auto gap-4 sm:w-[370px]">
      <p className="text-center text-2xl font-bold mt-8">Даты для рекламы</p>
      {ads ? (
        ads[0] ? (
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
          <p className="text-lg font-bold text-center">Нет дат для рекламы</p>
        )
      ) : (
        <div className="w-full flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      )}
    </main>
  );
}
