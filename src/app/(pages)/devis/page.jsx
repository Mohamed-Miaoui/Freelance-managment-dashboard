"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  FilePlus,
  CheckSquare,
  Send,
  PieChart,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  FileQuestion,
  Printer,
  Download,
  FileCheck,
} from "lucide-react";
import { useFormik } from "formik";
import axios from "axios";
import DevisPrintModal from "@/app/components/devis/DevisPrintModal";
import { useRouter } from "next/navigation";

const devis = () => {
  const router = useRouter();

  const [clients, setClients] = useState([]);
  const [devis, setDevis] = useState([]);
  const [settings, setSettings] = useState({});
  const [theme, setTheme] = useState("light");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingDevis, setEditingDevis] = useState(null);

  // state for print preview
  const [printDevis, setPrintDevis] = useState(null);
  const [currentLine, setCurrentLine] = useState({
    description: "",
    montant: 0,
  });
  const STATUS_OPTIONS = [
    { value: "en_attente", label: "En Attente" },
    { value: "accepte", label: "Accepté" },
    { value: "refuse", label: "Refusé" },
    { value: "expire", label: "Expiré" },
  ];

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

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/parametere");
      setSettings(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch clients
  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/client");
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch devis
  const fetchDevis = async () => {
    try {
      const response = await axios.get("/api/devis");
      setDevis(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDevis();
    fetchSettings();
  }, []);

  const handleSubmitDevis = async (values) => {
    try {
      const newDevis = await axios.post("/api/devis", values);
      if (newDevis) {
        setShowModal(false);
        formik.resetForm();
        setEditingDevis(null);
        fetchDevis();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateDevis = async (values) => {
    try {
      const response = await axios.put(
        `/api/devis/${editingDevis._id}`,
        values
      );
      if (response) {
        setShowModal(false);
        formik.resetForm();
        setEditingDevis(null);
        fetchDevis();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (quote) => {
    try {
      formik.setValues({
        client_id: quote.client_id._id || quote.client_id,
        numero: quote.numero,
        date_emission: quote.date_emission,
        date_validite: quote.date_validite,
        statut: quote.statut,
        montant_ht: quote.montant_ht,
        tva: quote.tva,
        timbre_fiscal: quote.timbre_fiscal || 0, //timbre fiscale and tax 0
        montant_ttc: quote.montant_ttc,
        montant_acompte: quote.montant_acompte || 0,
        conditions_paiement: quote.conditions_paiement || "",
        notes: quote.notes || "",
        lignes: quote.lignes || [],
      });
      setEditingDevis(quote);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  //close modal
  const closeModal = () => {
    setShowModal(false);
    formik.resetForm();
    setEditingDevis(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce devis?")) {
      try {
        await axios.delete(`/api/devis/${id}`);
        fetchDevis();
        alert("Devis supprimé avec succès");
      } catch (error) {
        console.error("Error deleting devis:", error);
        alert("Erreur lors de la suppression du devis");
      }
    }
  };

  //convert to facture
  const handleConvertToFacture = async (devis) => {
    try {
      // Check if invoice already exists for this devis
      const existingFacture = await axios.get(
        `/api/facture?devis_id=${devis._id}`
      );
      if (existingFacture.data.length > 0) {
        if (
          confirm("Une facture existe déjà pour ce devis. Voulez-vous la voir?")
        ) {
          router.push(`/invoices?highlight=${existingFacture.data[0]._id}`);
        }
        return;
      }

      // Confirm conversion
      if (!confirm(`Convertir le devis ${devis.numero} en facture?`)) {
        return;
      }

      // Generate invoice number
      const year = new Date().getFullYear();
      const response = await axios.get("/api/facture/count");
      const count = response.data.count;
      const factureNumero = `FAC-${year}-${String(count + 1).padStart(3, "0")}`;

      // Calculate due date (30 days from now by default)
      const dateEcheance = new Date();
      dateEcheance.setDate(dateEcheance.getDate() + 30);

      // Create invoice from devis
      const factureData = {
        devis_id: devis._id,
        client_id:
          typeof devis.client_id === "object"
            ? devis.client_id._id
            : devis.client_id,
        numero: factureNumero,
        date_emission: new Date().toISOString().split("T")[0],
        date_echeance: dateEcheance.toISOString().split("T")[0],
        statut: "en_attente",
        montant_ht: devis.montant_ht,
        tva: devis.tva,
        timbre_fiscal: devis.timbre_fiscal || 0, //timbre fiscale and tax 0
        montant_ttc: devis.montant_ttc,
        acompte: devis.montant_acompte || 0,
        conditions_paiement: devis.conditions_paiement || "",
        notes: `Facture générée depuis le devis ${devis.numero}`,
        lignes: devis.lignes || [],
        paiements: [],
      };

      const newFacture = await axios.post("/api/facture", factureData);

      if (newFacture) {
        alert(`Facture ${factureNumero} créée avec succès!`);
        router.push(`/invoices?highlight=${newFacture.data._id}`);
      }
    } catch (error) {
      console.error("Error converting to facture:", error);
      alert(
        "Erreur lors de la conversion: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  //  print handler
  const handlePrint = (dev) => {
    setPrintDevis(dev);
  };

  const formik = useFormik({
    initialValues: {
      client_id: "",
      numero: "",
      date_emission: "",
      date_validite: "",
      statut: "",
      montant_ht: "",
      tva: "",
      timbre_fiscal: "",
      montant_ttc: "",
      montant_acompte: "",
      conditions_paiement: "",
      notes: "",
      lignes: [],
    },
    // validationSchema: clientSchema,
    onSubmit: (values) => {
      if (editingDevis) {
        handleUpdateDevis(values);
      } else {
        handleSubmitDevis(values);
      }
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
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-white",
      textSecondary: "text-gray-400",
      border: "border-gray-700",
      hover: "hover:bg-gray-700",
      primary: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const currentTheme = themes[theme];

  const filteredDevis = devis.filter((d) => {
    const searchLower = searchTerm.toLowerCase();
    const numeroMatch = d.numero?.toLowerCase().includes(searchLower);
    const clientMatch = d.client_id?.nom?.toLowerCase().includes(searchLower);

    const matchesSearch = searchTerm === "" || numeroMatch || clientMatch;
    const matchesStatus = statusFilter === "all" || d.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const acceptedCount = devis.filter((d) => d.statut === "accepte").length;
  const conversionRate =
    devis.length > 0 ? (acceptedCount / devis.length) * 100 : 0;

  const quoteStats = [
    {
      label: "Total Devis",
      value: devis.length,
      icon: FilePlus,
      color: "text-blue-600",
    },
    {
      label: "Acceptés",
      value: acceptedCount,
      icon: CheckSquare,
      color: "text-green-600",
    },
    {
      label: "En Attente",
      value: devis.filter((d) => d.statut === "en_attente").length,
      icon: Send,
      color: "text-yellow-600",
    },
    {
      label: "Taux de Conversion",
      value: `${conversionRate.toFixed(1)}%`,
      icon: PieChart,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "accepte":
        return "bg-green-100 text-green-700";
      case "en_attente":
        return "bg-yellow-100 text-yellow-700";
      case "refuse":
        return "bg-red-100 text-red-700";
      case "expire":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="ml-64 p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quoteStats.map((stat, idx) => (
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
                  placeholder="Search by client or quote ID..."
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
                <option value="en_attente">En Attente</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
                <option value="expire">Expiré</option>
              </select>
              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
              >
                <Plus strokeWidth={1} size={20} />
                Create Quote
              </button>
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div
          className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${
                  currentTheme.bg === "bg-gray-50"
                    ? "bg-gray-50"
                    : "bg-gray-700"
                }`}
              >
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Numero
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
                    Date Emission
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Date Validité
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
                {filteredDevis.length > 0 ? (
                  filteredDevis.map((dev) => (
                    <tr
                      key={dev._id}
                      className={`${currentTheme.hover} transition-colors`}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap font-medium ${currentTheme.text}`}
                      >
                        {dev.numero}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                      >
                        {dev.client_id?.nom || "N/A"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                      >
                        {new Intl.NumberFormat("fr-TN", {
                          style: "currency",
                          currency: "TND",
                          minimumFractionDigits: 3,
                        }).format(dev.montant_ttc)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                      >
                        {new Date(dev.date_emission).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                      >
                        {new Date(dev.date_validite).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            dev.statut
                          )}`}
                        >
                          {STATUS_OPTIONS.find(
                            (opt) => opt.value === dev.statut
                          )?.label || dev.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handlePrint(dev)}
                          className={`${currentTheme.textSecondary} hover:text-green-600 mr-3 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110`}
                          title="Télécharger PDF"
                        >
                          <Download size={18} />
                        </button>

                        <button
                          onClick={() => handleEdit(dev)}
                          className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110`}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleConvertToFacture(dev)}
                          className={`${currentTheme.textSecondary} hover:text-purple-600 mr-3 transition-colors`}
                          title="Convertir en facture"
                          hidden={dev.statut !== "accepte"}
                        >
                          <FileCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(dev._id)}
                          className={`${currentTheme.textSecondary} hover:text-red-600 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className={`${currentTheme.textSecondary}`}>
                        <FileQuestion
                          size={48}
                          className="mx-auto mb-4 opacity-50"
                        />
                        <p className="text-lg">Aucun devis trouvé</p>
                        <p className="text-sm mt-2">
                          Créez votre premier devis pour commencer
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quote Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
              className={`${currentTheme.card} rounded-xl p-8 max-w-5xl w-full max-h-[90vh] flex flex-col`}
            >
              {/* Header - Fixed */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingDevis ? "Edit Quote" : "Create New Quote"}
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
                          {!editingDevis && (
                            <span className="text-xs text-gray-500">
                              (Auto-généré)
                            </span>
                          )}
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
                          name="date_validite"
                          type="date"
                          value={values.date_validite}
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
                        Lignes de Devis
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
                              <div
                                className={`col-span-9 ${currentTheme.text}`}
                              >
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
                      {editingDevis ? "Update Quote" : "Create Quote"}
                    </button>
                    <button
                      onClick={closeModal}
                      className={`px-6 py-3 border ${currentTheme.border} ${currentTheme.text} rounded-lg font-medium ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Print Modal */}
      {printDevis && (
        <DevisPrintModal
          devis={printDevis}
          clientInfo={printDevis.client_id}
          settings={settings}
          onClose={() => setPrintDevis(null)}
        />
      )}
    </div>
  );
};

export default devis;
