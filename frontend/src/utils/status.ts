  export const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "under_review":
        return "bg-blue-500/10 text-blue-500";
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };
  export const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "under_review":
        return "En Revisión";
      case "approved":
        return "Aprobado";
      case "rejected":
        return "Rechazado";
    }
  };
