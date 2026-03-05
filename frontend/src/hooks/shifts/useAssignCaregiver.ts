import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignCaregiverShift } from "../../api/shifts/assignCaregiverShift";

export const useAssignCaregiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, caregiverId }: { shiftId: string; caregiverId: string }) =>
      assignCaregiverShift(shiftId, caregiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["availableCaregivers"] });
    },
  });
};
