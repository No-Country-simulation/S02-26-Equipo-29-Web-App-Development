import { useQuery } from "@tanstack/react-query";
import { getRegistrations } from "../../api";
import type { RegistrationResponse } from "../../types";

export const useRegistrations = () => {
    return useQuery<RegistrationResponse>({
        queryKey: ["registrations"],
        queryFn: getRegistrations,
    });
}