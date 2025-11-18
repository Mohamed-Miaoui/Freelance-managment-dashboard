"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
  Eye,
  Trash2,
  Download,
  CreditCard,
} from "lucide-react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import FacturePrintModal from "@/app/components/facture/FacturePrintModal";

const Factures = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [factures, setFactures] = useState([]);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("virement");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [printFacture, setPrintFacture] = useState(null);
  const [settings, setSettings] = useState({});

  const STATUS_OPTIONS = [
    { value: "en_attente", label: "En Attente" },
    { value: "payee", label: "Payée" },
    { value: "en_retard", label: "En Retard" },
  ];

  const PAYMENT_MODES = [
    { value: "virement", label: "Virement" },
    { value: "especes", label: "Espèces" },
    { value: "cheque", label: "Chèque" },
    { value: "autre", label: "Autre" },
  ];

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/parametere");
      setSettings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch factures from API
  const fetchFactures = async () => {
    try {
      const response = await axios.get("/api/facture");
      setFactures(response.data);

      // Highlight newly created invoice
      if (highlightId) {
        setTimeout(() => {
          const element = document.getElementById(`facture-${highlightId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("bg-yellow-100");
            setTimeout(() => element.classList.remove("bg-yellow-100"), 2000);
          }
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchFactures();
  }, []);

  const handleAddPayment = (facture) => {
    setSelectedFacture(facture);
    setPaymentAmount(facture.solde_a_payer?.toString() || "");
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert("Veuillez entrer un montant valide");
      return;
    }

    try {
      const payment = {
        montant: parseFloat(paymentAmount),
        date_paiement: new Date().toISOString(),
        mode_paiement: paymentMode,
        reference: paymentReference,
        notes: paymentNotes,
      };

      await axios.post(`/api/facture/${selectedFacture._id}/payment`, payment);

      setShowPaymentModal(false);
      setPaymentAmount("");
      setPaymentReference("");
      setPaymentNotes("");
      fetchFactures();
      alert("Paiement enregistré avec succès!");
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Erreur lors de l'ajout du paiement");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce facture?")) {
      try {
        await axios.delete(`/api/facture/${id}`);
        fetchDevis();
        alert("facture supprimé avec succès");
      } catch (error) {
        console.error("Error deleting facture:", error);
        alert("Erreur lors de la suppression du devis");
      }
    }
  };

  const themes = {
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      hover: "hover:bg-gray-50",
      primary: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const currentTheme = themes[theme];

  const filteredFactures = factures.filter((f) => {
    if (!f) return false;
    const search = searchTerm.toLowerCase().trim();
    let matchesSearch = true;

    if (search !== "") {
      const numeroMatch = f.numero?.toLowerCase().includes(search) || false;
      const clientName =
        typeof f.client_id === "object" ? f.client_id?.nom : "";
      const clientMatch = clientName?.toLowerCase().includes(search) || false;
      matchesSearch = numeroMatch || clientMatch;
    }

    const matchesStatus = statusFilter === "all" || f.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "payee":
        return "bg-green-100 text-green-700";
      case "en_attente":
        return "bg-yellow-100 text-yellow-700";
      case "en_retard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalRevenu = factures.reduce((sum, facture) => {
    const facturePayments =
      facture.paiements?.reduce(
        (paymentSum, paiement) => paymentSum + paiement.montant,
        0
      ) || 0;

    const acompte = facture.acompte || 0;

    return sum + facturePayments + acompte;
  }, 0);

  const totalEnAttente = factures
    .filter((f) => f.statut !== "payee")
    .reduce((sum, f) => sum + (f.solde_a_payer || f.montant_ttc), 0);

  const factureStats = [
    {
      label: "Total Factures",
      value: factures.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Payées",
      value: factures.filter((f) => f.statut === "payee").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Revenu Total",
      value: `${totalRevenu.toFixed(3)} TND`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "À Recevoir",
      value: `${totalEnAttente.toFixed(3)} TND`,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="ml-64 p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {factureStats.map((stat, idx) => (
            <div
              key={idx}
              className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon
                  strokeWidth={1}
                  className={`${stat.color}`}
                  size={32}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div
          className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border} mb-6`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.textSecondary}`}
                  strokeWidth={1}
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Rechercher par numéro ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                />
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
              >
                <option value="all">Tous les statuts</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Factures Table */}
        {filteredFactures.length > 0 ? (
          <div
            className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Numéro
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Client
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Montant TTC
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Solde
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Échéance
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Statut
                    </th>
                    <th
                      className={`px-6 py-4 text-right text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${currentTheme.border}`}>
                  {filteredFactures.map((facture) => (
                    <tr
                      key={facture._id}
                      id={`facture-${facture._id}`}
                      className={`${currentTheme.hover} transition-all duration-500`}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap font-medium ${currentTheme.text}`}
                      >
                        {facture.numero}
                        {facture.devis_id && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Devis: {facture.devis_id.numero})
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                      >
                        {facture.client_id?.nom || "N/A"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                      >
                        {facture.montant_ttc?.toFixed(3)} TND
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          facture.solde_a_payer > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {facture.solde_a_payer?.toFixed(3)} TND
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                      >
                        {new Date(facture.date_echeance).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            facture.statut
                          )}`}
                        >
                          {
                            STATUS_OPTIONS.find(
                              (opt) => opt.value === facture.statut
                            )?.label
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {facture.statut !== "payee" && (
                          <button
                            onClick={() => handleAddPayment(facture)}
                            className={`${currentTheme.textSecondary} hover:text-green-600 mr-3 transition-colors`}
                            title="Ajouter un paiement"
                          >
                            <CreditCard size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => setPrintFacture(facture)}
                          className={`${currentTheme.textSecondary} hover:text-green-600 mr-3 transition-colors`}
                          title="Télécharger PDF"
                        >
                          <Download size={18} />
                        </button>
                        {printFacture && (
                          <FacturePrintModal
                            facture={printFacture}
                            clientInfo={printFacture.client_id}
                            settings={settings}
                            onClose={() => setPrintFacture(null)}
                          />
                        )}
                        <button
                          className={`${currentTheme.textSecondary} hover:text-red-600 transition-colors`}
                          onClick={() => handleDelete(facture._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 w-full">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-xl">Aucune facture trouvée</p>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">
                Enregistrer un paiement
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Facture: <strong>{selectedFacture?.numero}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Solde restant:{" "}
                <strong className="text-red-600">
                  {selectedFacture?.solde_a_payer?.toFixed(3)} TND
                </strong>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Montant
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="0.000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mode de paiement
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {PAYMENT_MODES.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Référence
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="N° chèque, virement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={2}
                    placeholder="Notes optionnelles..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={submitPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Factures;
