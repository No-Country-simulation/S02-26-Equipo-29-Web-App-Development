import { useQuery } from "@tanstack/react-query";
import { getPayment } from "../../api/admin/getPayment";

export const usePayment = (id: string | null) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPayment(id!),
    enabled: !!id,
  });
};
