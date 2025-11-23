"use client";
import React, { Suspense, useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import FacturePrintModal from "@/app/components/facture/FacturePrintModal";
import { useFormik } from "formik";

const FacturesContent = () => {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [showModal, setShowModal] = useState(false);
  const [factures, setFactures] = useState([]);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("virement");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [printFacture, setPrintFacture] = useState(null);
  const [settings, setSettings] = useState({});
  const [clients, setClients] = useState([]);
  const [currentLine, setCurrentLine] = useState({
    description: "",
    montant: 0,
  });

  const STATUS_OPTIONS = [
    { value: "en_attente", label: "En Attente" },
    { value: "payee", label: "Payée" },
    { value: "en_retard", label: "En Retard" },
  ];
  const TYPE_OPTIONS = [
    { value: "projet", label: "Projet" },
    { value: "maintenance", label: "Maintenance" },
    { value: "hebergement", label: "Hébergement" },
    { value: "ajout_fonction", label: "Ajout de fonctionnalités" },
    { value: "abonnement", label: "Abonnement" },
  ];

  const PAYMENT_MODES = [
    { value: "virement", label: "Virement" },
    { value: "especes", label: "Espèces" },
    { value: "cheque", label: "Chèque" },
    { value: "autre", label: "Autre" },
  ];

  //fetch clients
  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/client");
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // create facture
  const handleSubmitFacture = async (values) => {
    try {
      // Generate invoice number
      const year = new Date().getFullYear();
      const response = await axios.get("/api/facture/count");
      const count = response.data.count;
      const factureNumero = `FAC-${year}-${String(count + 1).padStart(3, "0")}`;
      values.numero = factureNumero;
      const newFacture = await axios.post("/api/facture", values);
      if (newFacture) {
        setShowModal(false);
        formik.resetForm();
        fetchFactures();
      }
    } catch (error) {
      console.log(error);
    }
  };
  //close modal
  const closeModal = () => {
    setShowModal(false);
    formik.resetForm();
  };

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
    fetchClients();
    fetchFactures();
  }, []);

  // Add a new line
  const addLigne = () => {
    if (!currentLine.description || currentLine.montant <= 0) {
      alert("Please fill all line item fields");
      return;
    }

    const newLigne = {
      description: currentLine.description,

      montant: Number(currentLine.montant),
    };

    formik.setFieldValue("lignes", [...values.lignes, newLigne]);

    // Reset current line
    setCurrentLine({
      description: "",
      montant: 0,
    });

    // Recalculate totals
    recalculateTotals([...values.lignes, newLigne]);
  };

  // Remove a line
  const removeLigne = (index) => {
    const newLignes = values.lignes.filter((_, i) => i !== index);
    formik.setFieldValue("lignes", newLignes);
    recalculateTotals(newLignes);
  };

  // Recalculate totals based on line items
  const recalculateTotals = (lignes) => {
    const montant_ht = lignes.reduce((sum, ligne) => sum + ligne.montant, 0);
    const tva_amount = (montant_ht * values.tva) / 100;
    const timbre_fiscal = 0; //timbre fiscale and tax 0
    const montant_ttc = montant_ht + tva_amount + timbre_fiscal;

    formik.setFieldValue("montant_ht", montant_ht.toFixed(3));
    formik.setFieldValue("montant_ttc", montant_ttc.toFixed(3));
  };

  // Handle current line changes
  const handleLineChange = (e) => {
    const { name, value } = e.target;
    setCurrentLine((prev) => {
      const updated = { ...prev, [name]: value };

      // // Auto-calculate montant when quantite or prix_unitaire changes
      // if (name === "quantite" || name === "prix_unitaire") {
      //   updated.montant =
      //     Number(updated.quantite) * Number(updated.prix_unitaire);
      // }

      return updated;
    });
  };

  // handleAddPayment
  const handleAddPayment = (facture) => {
    setSelectedFacture(facture);
    setPaymentAmount(facture.solde_a_payer?.toString() || "");
    setShowPaymentModal(true);
  };

  // handleAddPayment
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

  // handleDelete
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

  const formik = useFormik({
    initialValues: {
      client_id: "",
      numero: "",
      date_emission: "",
      date_echeance: "",
      statut: "",
      montant_ht: "",
      tva: "",
      timbre_fiscal: "",
      montant_ttc: "",
      montant_acompte: "",
      conditions_paiement: "",
      notes: "",
      type_prestation: "",
      lignes: [],
    },
    // validationSchema: clientSchema,
    onSubmit: (values) => {
      handleSubmitFacture(values);
    },
  });
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    validateForm,
    resetForm,
  } = formik;

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
    const typematch = typeFilter === "all" || f.type_prestation === typeFilter;
    return matchesSearch && matchesStatus && typematch;
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
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
              >
                <option value="all">Tous les Types</option>
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="flex p-2 px-4 font-extralight text-white border border-gray-700 bg-blue-600 rounded-lg "
                onClick={() => setShowModal(true)}
              >
                <Plus></Plus>
                Créer une facture
              </button>
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
                        {!facture.devis_id && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Devis direct:{" "}
                            <strong>{facture.type_prestation}</strong>)
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

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div
            className={`${currentTheme.card} rounded-xl p-8 max-w-5xl w-full max-h-[90vh] flex flex-col`}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                Créer une nouvelle facture
              </h2>
              <button
                onClick={closeModal}
                className={`${currentTheme.textSecondary} hover:${currentTheme.text}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 pr-5">
              {/* formik */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* select client */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      select client
                    </label>
                    <select
                      name="client_id"
                      value={values.client_id}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    >
                      <option value="">-- Select a client --</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.nom}
                        </option>
                      ))}
                    </select>
                    {errors.client_id && (
                      <p className="text-red-500">{errors.client_id}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Numero{" "}
                        <span className="text-xs text-gray-500">
                          (Auto-généré)
                        </span>
                      </label>
                      <input
                        name="numero"
                        type="text"
                        value={values.numero}
                        readOnly
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg bg-gray-100 cursor-not-allowed ${currentTheme.text}`}
                        placeholder="Auto-généré à la création"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Date d'emission
                      </label>
                      <input
                        name="date_emission"
                        type="date"
                        value={values.date_emission}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Date d'échéance
                      </label>
                      <input
                        name="date_echeance"
                        type="date"
                        value={values.date_echeance}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Statut
                      </label>
                      <select
                        name="statut"
                        value={values.statut}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      >
                        <option value="">-- Sélectionner un statut --</option>
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.statut && (
                        <p className="text-red-500">{errors.statut}</p>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Type de prestation
                      </label>
                      <select
                        name="type_prestation"
                        value={values.type_prestation}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      >
                        <option value="">
                          -- Sélectionner une prestation --
                        </option>
                        {TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.type_prestation && (
                        <p className="text-red-500">{errors.type_prestation}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        montant-ht
                      </label>
                      <div className="relative">
                        <input
                          name="montant_ht"
                          type="number"
                          value={values.montant_ht}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 pr-16 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                          placeholder="800"
                        />
                        <span
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} font-medium`}
                        >
                          TND
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        TVA
                      </label>
                      <div className="relative">
                        <input
                          name="tva"
                          type="number"
                          min={0}
                          max={100}
                          value={values.tva}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 pr-16 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                          placeholder="19"
                        />
                        <span
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} font-medium`}
                        >
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        montant_ttc
                      </label>
                      <div className="relative">
                        <input
                          name="montant_ttc"
                          type="number"
                          value={values.montant_ttc}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 pr-16 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                          placeholder="1000"
                        />
                        <span
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} font-medium`}
                        >
                          TND
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        montant_acompte
                      </label>
                      <div className="relative">
                        <input
                          name="montant_acompte"
                          type="number"
                          value={values.montant_acompte}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 pr-16 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                          placeholder="500"
                        />
                        <span
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} font-medium`}
                        >
                          TND
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Condition de paiement
                    </label>
                    <textarea
                      name="conditions_paiement"
                      value={values.conditions_paiement}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="first u must pay 50% of the total amount"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="Additional notes..."
                    />
                  </div>

                  {/* Line Items Section----------------- */}
                  <div
                    className={`border ${currentTheme.border} rounded-lg p-4`}
                  >
                    <h3
                      className={`text-lg font-semibold ${currentTheme.text} mb-4`}
                    >
                      Lignes de Facture
                    </h3>

                    {/* Add Line Form */}
                    <div className="grid grid-cols-12 gap-3 mb-4">
                      <div className="col-span-9">
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={currentLine.description}
                          onChange={handleLineChange}
                          className={`w-full px-3 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                          placeholder="Développement page d'accueil"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Montant
                        </label>
                        <input
                          name="montant"
                          type="number"
                          value={currentLine.montant}
                          onChange={handleLineChange}
                          className={`w-full px-3 py-2 border ${currentTheme.border} rounded-lg  ${currentTheme.text}`}
                          placeholder="Montant"
                        />
                      </div>
                      <div className="col-span-1 self-end">
                        <button
                          type="button"
                          onClick={addLigne}
                          className={`w-full px-3 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                        >
                          <Plus className="ml-2" size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Lines List */}
                    {values.lignes.length > 0 && (
                      <div className="space-y-2">
                        <div
                          className={`grid grid-cols-12 gap-3 px-3 py-2 ${currentTheme.textSecondary} text-xs font-semibold uppercase`}
                        >
                          <div className="col-span-9">Description</div>
                          <div className="col-span-2">Montant</div>
                          <div className="col-span-1"></div>
                        </div>
                        {values.lignes.map((ligne, index) => (
                          <div
                            key={index}
                            className={`grid grid-cols-12 gap-3 px-3 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover}`}
                          >
                            <div className={`col-span-9 ${currentTheme.text}`}>
                              {ligne.description}
                            </div>

                            <div
                              className={`col-span-2 font-semibold ${currentTheme.text}`}
                            >
                              {ligne.montant.toFixed(3)} TND
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeLigne(index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Total Summary */}
                        <div
                          className={`mt-4 pt-4 border-t ${currentTheme.border}`}
                        >
                          <div className="flex justify-end space-y-2">
                            <div className="w-64">
                              <div className="flex justify-between py-1">
                                <span className={currentTheme.textSecondary}>
                                  Montant HT:
                                </span>
                                <span
                                  className={`font-semibold ${currentTheme.text}`}
                                >
                                  {values.montant_ht} TND
                                </span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className={currentTheme.textSecondary}>
                                  TVA ({values.tva}%):
                                </span>
                                <span
                                  className={`font-semibold ${currentTheme.text}`}
                                >
                                  {(
                                    (values.montant_ht * values.tva) /
                                    100
                                  ).toFixed(3)}{" "}
                                  TND
                                </span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className={currentTheme.textSecondary}>
                                  Timbre Fiscal:
                                </span>
                                <span
                                  className={`font-semibold ${currentTheme.text}`}
                                >
                                  0.000 TND
                                </span>
                              </div>
                              <div
                                className={`flex justify-between py-2 border-t ${currentTheme.border} mt-2`}
                              >
                                <span
                                  className={`font-bold ${currentTheme.text}`}
                                >
                                  Total TTC:
                                </span>
                                <span
                                  className={`font-bold text-lg ${currentTheme.text}`}
                                >
                                  {values.montant_ttc} TND
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {values.lignes.length === 0 && (
                      <div
                        className={`text-center py-8 ${currentTheme.textSecondary}`}
                      >
                        Aucune ligne ajoutée. Ajoutez des lignes pour créer
                        votre devis.
                      </div>
                    )}
                  </div>
                </div>
                {/* Footer Buttons - Fixed */}
                <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    Créer Facture
                  </button>
                  <button
                    onClick={closeModal}
                    className={`px-6 py-3 border ${currentTheme.border} ${currentTheme.text} rounded-lg font-medium ${currentTheme.hover} transition-colors`}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Wrapping in Suspense is required by Next.js for useSearchParams()
 * to prevent build errors during static page generation.
 * Shows a loading fallback while search params are resolved client-side.
 */
const Factures = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <FacturesContent />
    </Suspense>
  );
};

export default Factures;
