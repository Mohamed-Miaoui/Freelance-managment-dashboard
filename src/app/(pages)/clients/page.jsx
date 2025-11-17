"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Briefcase,
  DollarSign,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Clock,
  BriefcaseBusiness,
  Mail,
  Phone,
} from "lucide-react";
import { useFormik } from "formik";
import { clientSchema } from "@/app/yup/schemas";
import axios from "axios";

const clients = () => {
  const [theme, setTheme] = useState("light");
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingRevenue, setPendingRevenue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/client");
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/project");
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClientStats = async () => {
    try {
      const response = await axios.get("/api/facture");
      const factures = response.data;

      // Total revenue = All payments received (including acomptes)
      const revenue = factures.reduce((sum, facture) => {
        const facturePayments =
          facture.paiements?.reduce(
            (paymentSum, paiement) => paymentSum + paiement.montant,
            0
          ) || 0;

        const acompte = facture.acompte || 0;

        return sum + facturePayments + acompte;
      }, 0);

      // Pending revenue = All outstanding balances (solde_a_payer)
      const pending = factures
        .filter((f) => f.statut !== "payee")
        .reduce((sum, facture) => sum + (facture.solde_a_payer || 0), 0);

      setTotalRevenue(revenue);
      setPendingRevenue(pending);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchProjects();

    fetchClientStats();
  }, []);

  const handleSubmitClient = async (values) => {
    try {
      const newClient = await axios.post("/api/client", values);
      if (newClient) {
        setShowModal(false);
        formik.resetForm();
        setEditingClient(null);
        fetchClients();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/client/${id}`);
      if (response) {
        fetchClients();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateClient = async (values) => {
    try {
      const response = await axios.put(
        `/api/client/${editingClient._id}`,
        values
      );
      if (response) {
        setShowModal(false);
        formik.resetForm();
        setEditingClient(null);
        fetchClients();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // This function opens the modal with client data
  const handleEdit = (client) => {
    try {
      formik.setValues({
        nom: client.nom,
        email: client.email,
        telephone: client.telephone || "",
        adresse: client.adresse,
        matricule_fiscal: client.matricule_fiscal || "",
        notes: client.notes || "",
      });
      setEditingClient(client);
      setShowModal(true);
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
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      matricule_fiscal: "",
      notes: "",
    },
    validationSchema: clientSchema,
    onSubmit: (values) => {
      if (editingClient) {
        handleUpdateClient(values);
      } else {
        handleSubmitClient(values);
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

  const filteredClients = clients.filter(
    (c) =>
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.matricule_fiscal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientStats = [
    {
      label: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Clients Actifs",
      value: clients.filter((c) => c.status === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Revenu Total",
      value: `${totalRevenue.toFixed(3)} TND`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "À Recevoir",
      value: `${pendingRevenue.toFixed(3)} TND`,
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
          {clientStats.map((stat, idx) => (
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
                  placeholder="Search clients by nom, telephone,M.Fiscale or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                />
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
            >
              <Plus strokeWidth={1} size={20} />
              Add Client
            </button>
          </div>
        </div>

        {/* Clients Table */}
        {clients.length > 0 ? (
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
                      Client
                    </th>

                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Adresse
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Total Spent
                    </th>

                    <th
                      className={`px-6 py-4 text-right text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${currentTheme.border}`}>
                  {filteredClients.map((client) => (
                    <tr
                      key={client._id}
                      className={`${currentTheme.hover} transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src="data:image/png;base64,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"
                            alt={client.nom}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div
                              className={`text-sm font-medium ${currentTheme.text}`}
                            >
                              {client.nom}
                            </div>
                            <div
                              className={`flex items-center text-xs ${currentTheme.textSecondary}`}
                            >
                              <Mail className="mr-1" size={12}></Mail>{" "}
                              {client.email}
                            </div>
                            <div
                              className={`flex items-center text-xs ${currentTheme.textSecondary}`}
                            >
                              <Phone className="mr-1" size={12}></Phone>{" "}
                              {client.telephone}
                            </div>
                            <div
                              className={`flex items-center text-xs ${currentTheme.textSecondary}`}
                            >
                              <p className="text-xs font-bold">M.Fiscale :</p>
                              {client.matricule_fiscal}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                      >
                        {client.adresse}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                      >
                        {/* ${client.totalSpent.toLocaleString()} */} $$
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            client.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleEdit(client)}
                          className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => console.log("projects")}
                          className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                        >
                          <BriefcaseBusiness size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
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
        ) : (
          <div className="flex items-center justify-center h-96 w-full">
            <div className="text-center">
              <p className="text-gray-500 text-xl">No clients found</p>
            </div>
          </div>
        )}

        {/* Client Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
              className={`${currentTheme.card} rounded-xl p-8 max-w-lg w-full`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingClient ? "Edit Client" : "Add New Client"}
                </h2>
                <button
                  onClick={closeModal}
                  className={`${currentTheme.textSecondary} hover:${currentTheme.text}`}
                >
                  <X size={24} />
                </button>
              </div>
              {/* formik */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={values.nom}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  {errors.nom && <p className="text-red-500">{errors.nom}</p>}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      matricule_fiscal
                    </label>
                    <input
                      type="text"
                      name="matricule_fiscal"
                      value={values.matricule_fiscal}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="e.g., Doe Corp"
                    />
                  </div>
                  {errors.matricule_fiscal && (
                    <p className="text-red-500">{errors.matricule_fiscal}</p>
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="e.g., john.doe@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Télephone
                    </label>
                    <input
                      type="number"
                      name="telephone"
                      value={values.telephone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="e.g., john.doe@example.com"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-red-500">{errors.telephone}</p>
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      adresse
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={values.adresse}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="e.g., Doe Corp"
                    />
                  </div>
                  {errors.adresse && (
                    <p className="text-red-500">{errors.adresse}</p>
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      commentaire
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="e.g., Doe Corp"
                    />
                  </div>
                  {errors.notes && (
                    <p className="text-red-500">{errors.notes}</p>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                    >
                      {editingClient ? "Update Client" : "Add Client"}
                    </button>
                    <button
                      onClick={closeModal}
                      className={`px-6 py-3 border ${currentTheme.border} ${currentTheme.text} rounded-lg font-medium ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default clients;
