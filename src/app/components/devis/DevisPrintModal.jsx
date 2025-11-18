import React, { useState } from "react";
import { X, Download, Eye } from "lucide-react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import DevisPDF from "./DevisPDF";

const DevisPrintModal = ({ devis, clientInfo, settings, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8 min-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Devis PDF</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Eye size={18} />
              {showPreview ? "Masquer" : "Aperçu"}
            </button>

            <PDFDownloadLink
              document={
                <DevisPDF
                  devis={devis}
                  clientInfo={clientInfo}
                  settings={settings}
                />
              }
              fileName={`Devis-${devis.numero}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {({ loading }) => (
                <>
                  <Download size={18} />
                  {loading ? "Génération..." : "Télécharger PDF"}
                </>
              )}
            </PDFDownloadLink>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        {showPreview && (
          <div className=" flex-1 overflow-hidden">
            <PDFViewer
              width="100%"
              height="100%"
              className="border-0 min-h-[70vh]"
            >
              <DevisPDF
                devis={devis}
                clientInfo={clientInfo}
                settings={settings}
              />
            </PDFViewer>
          </div>
        )}

        {!showPreview && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <Download size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600 mb-2">
                Devis prêt à télécharger
              </p>
              <p className="text-sm text-gray-500">
                Cliquez sur "Aperçu" pour voir le PDF ou "Télécharger" pour
                l'enregistrer
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevisPrintModal;
