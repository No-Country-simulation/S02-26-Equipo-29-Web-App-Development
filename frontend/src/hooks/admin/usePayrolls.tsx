import { useQuery } from "@tanstack/react-query"
import { getPayrolls } from "../../api"
import type { PayrollsResponse } from "../../types"

export const usePayrolls = (page: number = 1, limit = 10) => {
    return useQuery<PayrollsResponse>({
        queryKey: ["payrolls", page, limit],
        queryFn: () => getPayrolls(page, limit),
        staleTime: 1000 * 60 * 5,
    })
}