"use client";
import React, { useState } from "react";
import {
  Plus,
  Briefcase,
  Loader,
  CheckCircle,
  PauseCircle,
  Search,
  Edit2,
  Trash2,
  X,
  DollarSign,
} from "lucide-react";

const projects = () => {
  const [theme, setTheme] = useState("light");
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "E-commerce Platform",
      clientName: "Doe Corp",
      budget: 15000,
      deadline: "2025-01-15",
      status: "In Progress",
    },
    {
      id: 2,
      projectName: "Marketing Website",
      clientName: "Smith & Co.",
      budget: 8000,
      deadline: "2024-12-10",
      status: "Completed",
    },
    {
      id: 3,
      projectName: "Mobile App Design",
      clientName: "Johnson Solutions",
      budget: 12000,
      deadline: "2025-02-28",
      status: "On Hold",
    },
    {
      id: 4,
      projectName: "API Integration",
      clientName: "Doe Corp",
      budget: 6000,
      deadline: "2024-11-30",
      status: "In Progress",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    budget: "",
    deadline: "",
    status: "In Progress",
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
    if (
      !formData.projectName ||
      !formData.clientName ||
      !formData.budget ||
      !formData.deadline
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? {
                ...editingProject,
                ...formData,
                budget: parseFloat(formData.budget),
              }
            : p
        )
      );
    } else {
      setProjects([
        ...projects,
        {
          ...formData,
          id: Date.now(),
          budget: parseFloat(formData.budget),
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      clientName: "",
      budget: "",
      deadline: "",
      status: "In Progress",
    });
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setFormData({
      projectName: project.projectName,
      clientName: project.clientName,
      budget: project.budget.toString(),
      deadline: project.deadline,
      status: project.status,
    });
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      (p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || p.status === statusFilter)
  );

  const projectStats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      label: "In Progress",
      value: projects.filter((p) => p.status === "In Progress").length,
      icon: Loader,
      color: "text-yellow-600",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Total Budget",
      value: `$${projects
        .reduce((sum, p) => sum + p.budget, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "On Hold":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="ml-64 p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {projectStats.map((stat, idx) => (
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
                  placeholder="Search by project or client..."
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
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
              >
                <Plus strokeWidth={1} size={20} />
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
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
                    Project Name
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Client
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Budget
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Deadline
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
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={`${currentTheme.hover} transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium ${currentTheme.text}`}
                    >
                      {project.projectName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {project.clientName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                    >
                      ${project.budget.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {project.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status === "In Progress" && (
                          <Loader size={12} className="mr-2 animate-spin" />
                        )}
                        {project.status === "Completed" && (
                          <CheckCircle size={12} className="mr-2" />
                        )}
                        {project.status === "On Hold" && (
                          <PauseCircle size={12} className="mr-2" />
                        )}
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleEdit(project)}
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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

        {/* Project Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
              className={`${currentTheme.card} rounded-xl p-8 max-w-lg w-full`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingProject ? "Edit Project" : "Add New Project"}
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
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) =>
                      setFormData({ ...formData, projectName: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="e.g., E-commerce Platform"
                  />
                </div>
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
                    placeholder="e.g., Doe Corp"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
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
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    {editingProject ? "Update Project" : "Add Project"}
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

export default projects;
