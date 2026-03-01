import { api } from "../../lib/axios/api";


export const getCaregiverDocuments = async () => {
    const response = await api.get("/caregivers/my_documents");
    return response.data;
}