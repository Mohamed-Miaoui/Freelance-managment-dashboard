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
} from "lucide-react";
import { useFormik } from "formik";
import axios from "axios";

const devis = () => {
  const [clients, setClients] = useState([]);
  const [devis, setDevis] = useState([]);
  const [theme, setTheme] = useState("light");
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    clientName: "",
    amount: "",
    expiryDate: "",
    status: "Sent",
  });
  const [editingDevis, setEditingDevis] = useState(null);
  const [quotes, setQuotes] = useState([
    {
      id: "Q-2024-001",
      clientName: "John Doe",
      amount: 5000,
      expiryDate: "2024-11-30",
      status: "Accepted",
    },
    {
      id: "Q-2024-002",
      clientName: "Jane Smith",
      amount: 8500,
      expiryDate: "2024-12-05",
      status: "Sent",
    },
    {
      id: "Q-2024-003",
      clientName: "Mike Johnson",
      amount: 3200,
      expiryDate: "2024-11-10",
      status: "Declined",
    },
  ]);
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
    const timbre_fiscal = 0.6;
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

  //fetch clients
  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/client");
      setClients(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch devis
  const fetchDevis = async () => {
    try {
      const response = await axios.get("/api/devis");
      setDevis(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDevis();
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
  const closeModal = () => {
    setShowModal(false);
    formik.resetForm();
    setEditingClient(null);
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

  const filteredQuotes = quotes.filter(
    (q) =>
      (q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || q.status === statusFilter)
  );

  const acceptedCount = quotes.filter((q) => q.status === "Accepted").length;
  const conversionRate =
    quotes.length > 0 ? (acceptedCount / quotes.length) * 100 : 0;

  const quoteStats = [
    {
      label: "Total Quotes",
      value: quotes.length,
      icon: FilePlus,
      color: "text-blue-600",
    },
    {
      label: "Accepted",
      value: acceptedCount,
      icon: CheckSquare,
      color: "text-green-600",
    },
    {
      label: "Pending",
      value: quotes.filter((q) => q.status === "Sent").length,
      icon: Send,
      color: "text-yellow-600",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      icon: PieChart,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Sent":
        return "bg-yellow-100 text-yellow-700";
      case "Declined":
        return "bg-red-100 text-red-700";
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
                <option value="all">All Status</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
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
                    Quote ID
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Client
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Amount
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Expiry Date
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-4 text-right text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${currentTheme.border}`}>
                {filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className={`${currentTheme.hover} transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium ${currentTheme.text}`}
                    >
                      {quote.id}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {quote.clientName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                    >
                      ${quote.amount.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {quote.expiryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          quote.status
                        )}`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(quote)}
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className={`${currentTheme.textSecondary} hover:text-red-600 transition-colors`}
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

        {/* Quote Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
              className={`${currentTheme.card} rounded-xl p-8 max-w-5xl w-full max-h-[90vh] flex flex-col`}
            >
              {/* Header - Fixed */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingQuote ? "Edit Quote" : "Create New Quote"}
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
                <div className="space-y-4">
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
                        Numero
                      </label>
                      <input
                        name="numero"
                        type="text"
                        value={values.numero}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                        placeholder="Devis-2024-001"
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
                                  0.600 TND
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
              </div>

              {/* Footer Buttons - Fixed */}
              <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                >
                  {editingQuote ? "Update Quote" : "Create Quote"}
                </button>
                <button
                  onClick={closeModal}
                  className={`px-6 py-3 border ${currentTheme.border} ${currentTheme.text} rounded-lg font-medium ${currentTheme.hover} transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default devis;
