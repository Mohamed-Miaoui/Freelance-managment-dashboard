import React from "react";
import { X, Printer, Download, Mail } from "lucide-react";

const DevisPrintModal = ({ devis, clientInfo, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header - No Print - FIXED */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Aperçu du Devis</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Printer size={18} />
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Printable Content - SCROLLABLE */}
        <div className="overflow-y-auto flex-1 print:overflow-visible">
          <div className="p-12 bg-white print:p-8" id="devis-content">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                  {clientInfo.nom}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{clientInfo.adresse}</p>
                  <p>Tél: {clientInfo.telephone}</p>
                  <p>Email: {clientInfo.email}</p>
                  <p>M.F: {clientInfo.matricule_fiscal}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg mb-4">
                  <h2 className="text-2xl font-bold">DEVIS</h2>
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  N° {devis.numero}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Date: {formatDate(devis.date_emission)}</p>
                  <p>Validité: {formatDate(devis.date_validite)}</p>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Client
              </h3>
              <div className="text-gray-800">
                <p className="font-bold text-lg mb-2">{devis.client_id?.nom}</p>
                <div className="text-sm space-y-1">
                  <p>{devis.client_id?.adresse}</p>
                  <p>Tél: {devis.client_id?.telephone}</p>
                  <p>Email: {devis.client_id?.email}</p>
                  <p>M.F: {devis.client_id?.matricule_fiscal}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                      Montant (TND)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {devis.lignes?.map((ligne, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {ligne.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">
                        {formatCurrency(ligne.montant)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Montant HT:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(devis.montant_ht)} TND
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">
                      TVA ({devis.tva}%):
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency((devis.montant_ht * devis.tva) / 100)} TND
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">
                      Timbre Fiscal:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(devis.timbre_fiscal)} TND
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded-lg">
                  <span className="font-bold text-lg">Total TTC:</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(devis.montant_ttc)} TND
                  </span>
                </div>
                {devis.montant_acompte > 0 && (
                  <div className="flex justify-between py-2 px-4 mt-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
                    <span className="font-semibold text-sm">
                      Acompte demandé:
                    </span>
                    <span className="font-bold text-sm">
                      {formatCurrency(devis.montant_acompte)} TND
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Conditions & Notes */}
            {devis.conditions_paiement && (
              <div className="mb-6 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                  Conditions de Paiement
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {devis.conditions_paiement}
                </p>
              </div>
            )}

            {devis.notes && (
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                  Notes
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {devis.notes}
                </p>
              </div>
            )}

            {/* Signature Section */}
            <div className="mt-12 pt-8 border-t-2 border-gray-300">
              <div className="flex justify-between">
                <div className="text-center w-1/2">
                  <p className="text-sm font-semibold text-gray-700 mb-16">
                    Le Prestataire
                  </p>
                  <div className="border-t-2 border-gray-400 w-48 mx-auto pt-2">
                    <p className="text-xs text-gray-600">Signature & Cachet</p>
                  </div>
                </div>
                <div className="text-center w-1/2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Le Client
                  </p>
                  <p className="text-xs text-gray-500 mb-12">
                    (Bon pour accord)
                  </p>
                  <div className="border-t-2 border-gray-400 w-48 mx-auto pt-2">
                    <p className="text-xs text-gray-600">Signature & Date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #devis-content,
          #devis-content * {
            visibility: visible;
          }
          #devis-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20mm;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default DevisPrintModal;
