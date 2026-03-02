import { useState } from "react";
import { api } from "../../lib/axios/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  caregiverName: string;
  amount: number;
  cbu: string;
  mercadoPagoAlias: string;
  ids: string[];
  onClose: () => void;
};

export function PaymentModal({
  caregiverName,
  amount,
  cbu,
  mercadoPagoAlias,
  ids,
  onClose,
}: Props) {
  const [method, setMethod] = useState<"transfer" | "mercadopago" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
  if (!method) return;

  // TRANSFERENCIA
  if (method === "transfer") {
    if (!file) {
      toast.error("Debes subir el comprobante");
      return;
    }

    const formData = new FormData();
    formData.append("transfer_receipt", file);
    formData.append("amount", String(amount));
    formData.append("cbu", cbu);
    formData.append("alias", mercadoPagoAlias);
    formData.append("ids", ids.join(","));

    try {
      await api.post("/payments/transfer", formData, {
      headers: { "Content-Type": "multipart/form-data" },
       timeout: 60000,
    });
    queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    toast.success("Pago realizado correctamente");
    onClose();
      } catch {
        toast.error("Error al procesar el pago");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    setFile(e.target.files[0]);
  }
};
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Liquidar pago
            </h2>
            <p className="text-sm text-gray-500">
              {caregiverName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Monto a pagar</p>
          <p className="text-3xl font-bold text-blue-700">
            ${amount.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Payment methods */}
        <div className="space-y-3 mb-6">
          
          {/* Transfer */}
          <button
            onClick={() => setMethod("transfer")}
            className={`w-full border rounded-xl p-4 text-left transition
              ${method === "transfer"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"}
            `}
          >
            <p className="font-medium text-gray-800">
              Transferencia bancaria
            </p>
            <p className="text-sm text-gray-500">
              Pagar usando CBU o Alias del cuidador
            </p>
          </button>

          {
            method === "transfer" && (
             <div className="flex items-center gap-2">

               <div className="space-y-2 px-2">
              <p className="text-sm ">
                CBU: <span className="font-bold">{cbu}</span>
              </p>
              <p className="text-sm ">
                Alias: <span className="font-bold">{mercadoPagoAlias}</span>
              </p>
              </div>          
             </div> 
          )}

          {/* MercadoPago */}
          <button
            onClick={() => setMethod("mercadopago")}
            className={`w-full border rounded-xl p-4 text-left transition
              ${method === "mercadopago"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"}
            `}
          >
            <p className="font-medium text-gray-800">
              MercadoPago
            </p>
            <p className="text-sm text-gray-500">
              Pagar con checkout online
            </p>
          </button>

        </div>
        {method === "transfer" &&   <div className="flex items-center justify-center gap-2 pb-2">
                 <DocumentInput 
                 handleFileUpload={handleFileUpload}
                 id="comprobante"
                 />
             </div>}
             {
              method === "transfer" && file && (
                <div className="flex items-center justify-center gap-2 p-2">
                  <p className="text-sm ">
                    Comprobante: <span className="font-bold">{file.name}</span>
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              )
             }

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>

          <button
            disabled={!method}
            onClick={() => method && handleConfirm()}
            className={`w-full py-3 rounded-xl font-medium text-white transition
              ${method
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  );
}


interface DocumentInputProps {
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
}

const DocumentInput = ({ handleFileUpload, id }: DocumentInputProps) => {
    return (
        <label
            htmlFor={id}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/10 w-full py-4 text-center text-sm text-primary transition hover:border-primary-hover hover:bg-primary/20 cursor-pointer"
        >
            <span className="text-lg whitespace-nowrap">📁 Subír comprobante</span>
            <span className="text-xs text-slate-400 whitespace-nowrap">PDF, DOC, JPG o PNG</span>
            <input
                id={id}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="sr-only"
            />
        </label>
    )
}
