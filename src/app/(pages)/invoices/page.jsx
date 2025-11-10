"use client";
import React, { useState } from "react";
import {
  Plus,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
} from "lucide-react";

const invoices = () => {
  const [theme, setTheme] = useState("light");
  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      clientName: "John Doe",
      amount: 2500,
      dueDate: "2024-11-15",
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      clientName: "Jane Smith",
      amount: 4200,
      dueDate: "2024-11-20",
      status: "Pending",
    },
    {
      id: "INV-2024-003",
      clientName: "Mike Johnson",
      amount: 1500,
      dueDate: "2024-10-25",
      status: "Overdue",
    },
    {
      id: "INV-2024-004",
      clientName: "Jane Smith",
      amount: 7800,
      dueDate: "2024-12-01",
      status: "Pending",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    clientName: "",
    amount: "",
    dueDate: "",
    status: "Pending",
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

  const getNextInvoiceId = () => {
    const lastId =
      invoices.length > 0
        ? parseInt(invoices[invoices.length - 1].id.split("-")[2])
        : 0;
    return `INV-2024-${(lastId + 1).toString().padStart(3, "0")}`;
  };

  const handleSubmit = () => {
    if (!formData.clientName || !formData.amount || !formData.dueDate) {
      alert("Please fill all fields");
      return;
    }

    if (editingInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...editingInvoice,
                ...formData,
                amount: parseFloat(formData.amount),
              }
            : inv
        )
      );
    } else {
      setInvoices([
        ...invoices,
        {
          ...formData,
          id: getNextInvoiceId(),
          amount: parseFloat(formData.amount),
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ clientName: "", amount: "", dueDate: "", status: "Pending" });
    setEditingInvoice(null);
    setShowModal(false);
  };

  const handleEdit = (invoice) => {
    setFormData({
      clientName: invoice.clientName,
      amount: invoice.amount.toString(),
      dueDate: invoice.dueDate,
      status: invoice.status,
    });
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      (inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || inv.status === statusFilter)
  );

  const invoiceStats = [
    {
      label: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Total Billed",
      value: `$${invoices
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Pending Amount",
      value: `$${invoices
        .filter((inv) => inv.status === "Pending")
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toLocaleString()}`,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Overdue",
      value: `$${invoices
        .filter((inv) => inv.status === "Overdue")
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toLocaleString()}`,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
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
          {invoiceStats.map((stat, idx) => (
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
                  placeholder="Search by client or invoice ID..."
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
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
              >
                <Plus strokeWidth={1} size={20} />
                Create Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
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
                    Invoice ID
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
                    Due Date
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
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className={`${currentTheme.hover} transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium ${currentTheme.text}`}
                    >
                      {invoice.id}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {invoice.clientName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                    >
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(invoice)}
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
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

        {/* Invoice Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
              className={`${currentTheme.card} rounded-xl p-8 max-w-lg w-full`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
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
                    placeholder="e.g., John Doe"
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
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
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
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    {editingInvoice ? "Update Invoice" : "Create Invoice"}
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

export default invoices;
