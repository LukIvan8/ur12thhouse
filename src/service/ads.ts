import { pb } from ".";
import { AdData } from "./types";

export const listAll = async () => {
  const data = await pb
    .collection("ads_lana")
    .getFullList<AdData>({ sort: "+date" });
  return data;
};

export const create = (date: string, open: boolean) => {
  return pb.collection("ads_lana").create<AdData>({ date, open });
};

export const remove = (id: string) => {
  return pb.collection("ads_lana").delete(id);
};

export const flipOpen = async (id: string) => {
  const record = await pb.collection("ads_lana").getOne<AdData>(id);
  return pb
    .collection("ads_lana")
    .update(id, { date: record.date, open: !record.open });
};
