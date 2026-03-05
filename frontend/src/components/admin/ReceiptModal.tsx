import { X, Loader2, Download, ExternalLink, FileText } from "lucide-react";
import { usePayment } from "../../hooks";

interface ReceiptModalProps {
  paymentId: string;
  onClose: () => void;
}

export function ReceiptModal({ paymentId, onClose }: ReceiptModalProps) {
  const { data: payment, isLoading, isError } = usePayment(paymentId);

  const isPDF = payment?.transfer_receipt?.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              Comprobante de Pago
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Referencia: <span className="font-mono text-primary">{paymentId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-background/30 flex flex-col items-center justify-center min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-text-secondary">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="font-medium animate-pulse">Obteniendo comprobante...</p>
            </div>
          ) : isError ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                <X size={32} />
              </div>
              <p className="text-red-500 font-bold text-lg">Error al cargar el comprobante</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
              >
                Cerrar
              </button>
            </div>
          ) : !payment?.transfer_receipt ? (
            <div className="text-center space-y-2">
              <p className="text-text-secondary italic">No se encontró una imagen para este comprobante.</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isPDF ? (
                <div className="flex flex-col items-center gap-6 p-12 bg-surface border border-border rounded-3xl shadow-lg border-dashed max-w-md w-full text-center">
                  <div className="p-6 bg-primary/10 rounded-3xl text-primary transform hover:rotate-12 transition-transform">
                    <FileText size={64} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Documento PDF</h3>
                    <p className="text-sm text-text-secondary">
                      El comprobante se encuentra en formato PDF. Podés descargarlo o verlo en una pestaña nueva.
                    </p>
                  </div>
                  <a
                    href={payment.transfer_receipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                  >
                    Abrir en nueva pestaña <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              ) : (
                <div className="relative group max-w-full">
                  <img
                    src={payment.transfer_receipt}
                    alt="Comprobante de Transferencia"
                    className="max-h-[60vh] rounded-2xl border border-border shadow-lg transition-all group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-2xl">
                    <a
                      href={payment.transfer_receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-surface rounded-2xl text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-xl"
                      title="Ver original"
                    >
                      <ExternalLink size={24} />
                    </a>
                    <a
                      href={payment.transfer_receipt}
                      download
                      className="p-4 bg-surface rounded-2xl text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-xl"
                      title="Descargar"
                    >
                      <Download size={24} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        {payment && (
          <div className="p-6 border-t border-border bg-surface/50 text-xs flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div>
                 <p className="text-text-secondary uppercase tracking-widest font-black opacity-40 mb-1">Monto Pagado</p>
                 <p className="text-lg font-black text-primary">${Number(payment.amount).toLocaleString()}</p>
               </div>
               <div className="w-px h-8 bg-border" />
               <div>
                  <p className="text-text-secondary uppercase tracking-widest font-black opacity-40 mb-1">Fecha de Pago</p>
                  <p className="text-lg font-black text-text-primary capitalize">{new Date(payment.paid_at).toLocaleDateString()}</p>
               </div>
            </div>
            {!isPDF && payment.transfer_receipt && (
               <a
                href={payment.transfer_receipt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-bold flex items-center gap-1"
               >
                 Ver en Cloudinary <ExternalLink size={12} />
               </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
