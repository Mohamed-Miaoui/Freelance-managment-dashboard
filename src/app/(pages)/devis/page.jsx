"use client";
import React, { useState } from "react";
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
} from "lucide-react";

const devis = () => {
  const [theme, setTheme] = useState("light");
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

  const getNextQuoteId = () => {
    const lastId =
      quotes.length > 0
        ? parseInt(quotes[quotes.length - 1].id.split("-")[2])
        : 0;
    return `Q-2024-${(lastId + 1).toString().padStart(3, "0")}`;
  };

  const handleSubmit = () => {
    if (!formData.clientName || !formData.amount || !formData.expiryDate) {
      alert("Please fill all fields");
      return;
    }

    if (editingQuote) {
      setQuotes(
        quotes.map((q) =>
          q.id === editingQuote.id
            ? {
                ...editingQuote,
                ...formData,
                amount: parseFloat(formData.amount),
              }
            : q
        )
      );
    } else {
      setQuotes([
        ...quotes,
        {
          ...formData,
          id: getNextQuoteId(),
          amount: parseFloat(formData.amount),
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ clientName: "", amount: "", expiryDate: "", status: "Sent" });
    setEditingQuote(null);
    setShowModal(false);
  };

  const handleEdit = (quote) => {
    setFormData({
      clientName: quote.clientName,
      amount: quote.amount.toString(),
      expiryDate: quote.expiryDate,
      status: quote.status,
    });
    setEditingQuote(quote);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      setQuotes(quotes.filter((q) => q.id !== id));
    }
  };

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
              className={`${currentTheme.card} rounded-xl p-8 max-w-lg w-full`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingQuote ? "Edit Quote" : "Create New Quote"}
                </h2>
                <button
                  onClick={resetForm}
                  className={`${currentTheme.textSecondary} hover:${currentTheme.text}`}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="e.g., Jane Smith"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  >
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    {editingQuote ? "Update Quote" : "Create Quote"}
                  </button>
                  <button
                    onClick={resetForm}
                    className={`px-6 py-3 border ${currentTheme.border} ${currentTheme.text} rounded-lg font-medium ${currentTheme.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default devis;
