"use client";
import React, { useState } from "react";
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
} from "lucide-react";

const clients = () => {
  const [theme, setTheme] = useState("light");
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Doe",
      company: "Doe Corp",
      email: "john.doe@doecorp.com",
      projects: 3,
      totalSpent: 5000,
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=john.doe@doecorp.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      company: "Smith & Co.",
      email: "jane.smith@smith.co",
      projects: 5,
      totalSpent: 12000,
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=jane.smith@smith.co",
    },
    {
      id: 3,
      name: "Mike Johnson",
      company: "Johnson Solutions",
      email: "mike.j@johnsonsolutions.com",
      projects: 1,
      totalSpent: 1500,
      status: "inactive",
      avatar: "https://i.pravatar.cc/150?u=mike.j@johnsonsolutions.com",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    avatar: "",
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

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    const avatar =
      formData.avatar || `https://i.pravatar.cc/150?u=${formData.email}`;

    if (editingClient) {
      setClients(
        clients.map((c) =>
          c.id === editingClient.id
            ? { ...editingClient, ...formData, avatar }
            : c
        )
      );
    } else {
      setClients([
        ...clients,
        {
          ...formData,
          id: Date.now(),
          projects: 0,
          totalSpent: 0,
          status: "active",
          avatar,
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", company: "", email: "", avatar: "" });
    setEditingClient(null);
    setShowModal(false);
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      avatar: client.avatar,
    });
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientStats = [
    {
      label: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Active Clients",
      value: clients.filter((c) => c.status === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Total Projects",
      value: clients.reduce((sum, c) => sum + c.projects, 0),
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      label: "Total Revenue",
      value: `$${clients
        .reduce((sum, c) => sum + c.totalSpent, 0)
        .toLocaleString()}`,
      icon: DollarSign,
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
                  placeholder="Search clients by name, company, or email..."
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
                    Company
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Projects
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Total Spent
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
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className={`${currentTheme.hover} transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${currentTheme.text}`}
                          >
                            {client.name}
                          </div>
                          <div
                            className={`text-xs ${currentTheme.textSecondary}`}
                          >
                            {client.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {client.company}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {client.projects}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                    >
                      ${client.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          client.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleEdit(client)}
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="e.g., Doe Corp"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="e.g., john.doe@example.com"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Avatar URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    {editingClient ? "Update Client" : "Add Client"}
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

export default clients;
