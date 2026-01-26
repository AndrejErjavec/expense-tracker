import { parse, format } from "date-fns";

export const formatToIso = (date: string) => {
  const d = parse(date, "d.M.yyyy", new Date());
  return format(d, "yyyy-MM-dd");
};
