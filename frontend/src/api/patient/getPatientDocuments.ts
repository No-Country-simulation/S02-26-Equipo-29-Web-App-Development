import { api } from "../../lib/axios/api";


export const getPatientDocuments = async () => {
    const response = await api.get("/patients/my_documents");
    return response.data;
}