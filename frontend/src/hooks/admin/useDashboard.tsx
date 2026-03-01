import { useQuery } from "@tanstack/react-query"
import { getDashboard } from "../../api"
import type { DashboardResponse } from "../../types"

export const useDashboard = () => {
    return useQuery<DashboardResponse>({
        queryKey: ["dashboard"],
        queryFn: () => getDashboard(),
        staleTime: 1000 * 60 * 5,
    })
}