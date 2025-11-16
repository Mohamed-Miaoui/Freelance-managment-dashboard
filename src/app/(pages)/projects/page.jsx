"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  CircleDashed,
  XCircle,
  FileText,
  Users,
  DollarSign,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  X,
} from "lucide-react";
import axios from "axios";
import { useFormik } from "formik";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [devisList, setDevisList] = useState([]);
  const [viewMode, setViewMode] = useState("kanban"); // kanban or list
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [theme, setTheme] = useState("light");

  const STATUS_CONFIG = {
    devis: {
      label: "Devis",
      icon: FileText,
      color: "bg-gray-100 text-gray-700 border-gray-300",
    },
    en_cours: {
      label: "En Cours",
      icon: CircleDashed,
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    termine: {
      label: "Terminé",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700 border-green-300",
    },
    annule: {
      label: "Annulé",
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-300",
    },
  };

  const TYPE_LABELS = {
    site_web: "Site Web",
    app_mobile: "App Mobile",
    ecommerce: "E-commerce",
    autre: "Autre",
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/project");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/client");
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDevis = async () => {
    try {
      const response = await axios.get("/api/devis");
      // Only get accepted devis
      setDevisList(response.data.filter((d) => d.statut === "accepte"));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchDevis();
  }, []);

  const handleSubmitProject = async (values) => {
    try {
      const projectData = {
        ...values,
        date_debut: values.date_debut || null,
        date_fin_prevue: values.date_fin_prevue || null,
      };

      const response = await axios.post("/api/project", projectData);

      if (response) {
        alert("Projet créé avec succès!");
        setShowModal(false);
        formik.resetForm();
        setEditingProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du projet");
    }
  };

  const handleUpdateProject = async (values) => {
    try {
      const response = await axios.put(
        `/api/project/${editingProject._id}`,
        values
      );

      if (response) {
        alert("Projet mis à jour avec succès!");
        setShowModal(false);
        formik.resetForm();
        setEditingProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du projet");
    }
  };

  const handleEdit = (project) => {
    formik.setValues({
      client_id: project.client_id._id || project.client_id,
      nom: project.nom,
      description: project.description || "",
      statut: project.statut,
      type: project.type,
      date_debut: project.date_debut
        ? new Date(project.date_debut).toISOString().split("T")[0]
        : "",
      date_fin_prevue: project.date_fin_prevue
        ? new Date(project.date_fin_prevue).toISOString().split("T")[0]
        : "",
      budget: project.budget || 0,
      devis_id: project.devis_id?._id || "",
      notes: project.notes || "",
      pourcentage_completion: project.pourcentage_completion || 0,
    });
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet?")) {
      try {
        await axios.delete(`/api/project/${id}`);
        fetchProjects();
        alert("Projet supprimé avec succès");
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    formik.resetForm();
    setEditingProject(null);
  };

  const formik = useFormik({
    initialValues: {
      client_id: "",
      nom: "",
      description: "",
      statut: "devis",
      type: "site_web",
      date_debut: "",
      date_fin_prevue: "",
      budget: 0,
      pourcentage_completion: 0,
      devis_id: "",
      notes: "",
    },
    onSubmit: (values) => {
      if (editingProject) {
        handleUpdateProject(values);
      } else {
        handleSubmitProject(values);
      }
    },
  });

  const { values, errors, handleChange, handleSubmit } = formik;

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client_id?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const projectsByStatus = {
    devis: filteredProjects.filter((p) => p.statut === "devis"),
    en_cours: filteredProjects.filter((p) => p.statut === "en_cours"),
    termine: filteredProjects.filter((p) => p.statut === "termine"),
  };

  const stats = [
    {
      label: "Total Projets",
      value: projects.length,
      icon: LayoutGrid,
      color: "text-blue-600",
    },
    {
      label: "En Cours",
      value: projects.filter((p) => p.statut === "en_cours").length,
      icon: CircleDashed,
      color: "text-orange-600",
    },
    {
      label: "Terminés",
      value: projects.filter((p) => p.statut === "termine").length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Budget Total",
      value: `${projects
        .reduce((sum, p) => sum + (p.budget || 0), 0)
        .toFixed(0)} TND`,
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  const ProjectCard = ({ project }) => {
    const statusConfig = STATUS_CONFIG[project.statut];
    const StatusIcon = statusConfig.icon;

    return (
      <div
        className={`${currentTheme.card} rounded-xl p-4 shadow-sm border ${currentTheme.border} hover:shadow-md transition-all mb-3 cursor-pointer`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3
              className={`font-semibold ${currentTheme.text} mb-1 line-clamp-1`}
            >
              {project.nom}
            </h3>
            <p
              className={`text-xs ${currentTheme.textSecondary} flex items-center`}
            >
              <Users size={12} className="mr-1" />
              {project.client_id?.nom || "N/A"}
            </p>
          </div>
          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
            <div className="hidden group-hover:block absolute right-0 mt-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleEdit(project)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 size={14} />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            {TYPE_LABELS[project.type]}
          </span>
          {project.devis_id && (
            <span className={`text-xs ${currentTheme.textSecondary}`}>
              {project.devis_id.numero}
            </span>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p
            className={`text-xs ${currentTheme.textSecondary} mb-3 line-clamp-2`}
          >
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.textSecondary}>Progression</span>
            <span className={`font-semibold ${currentTheme.text}`}>
              {project.pourcentage_completion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${project.pourcentage_completion}%` }}
            />
          </div>
        </div>

        {/* Tasks Summary */}
        {project.taches?.length > 0 && (
          <div
            className={`flex items-center gap-3 text-xs ${currentTheme.textSecondary} mb-3`}
          >
            <span className="flex items-center">
              <CheckSquare size={14} className="mr-1" />
              {project.taches.filter((t) => t.statut === "termine").length}/
              {project.taches.length} tâches
            </span>
          </div>
        )}

        {/* Footer */}
        <div
          className={`flex items-center justify-between pt-3 border-t ${currentTheme.border}`}
        >
          <div
            className={`flex items-center text-xs ${currentTheme.textSecondary}`}
          >
            <Clock size={12} className="mr-1" />
            {project.date_fin_prevue
              ? new Date(project.date_fin_prevue).toLocaleDateString("fr-FR")
              : "Non défini"}
          </div>
          <div className={`text-xs font-semibold ${currentTheme.text}`}>
            {project.budget?.toFixed(0) || 0} TND
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="ml-64 p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
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
                <stat.icon strokeWidth={1} className={stat.color} size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div
          className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border} mb-6`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.textSecondary}`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Rechercher par projet ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
              >
                <option value="all">Tous les types</option>
                <option value="site_web">Site Web</option>
                <option value="app_mobile">App Mobile</option>
                <option value="ecommerce">E-commerce</option>
                <option value="autre">Autre</option>
              </select>

              {/* View Mode Toggle */}
              <div
                className={`flex gap-1 border ${currentTheme.border} rounded-lg p-1`}
              >
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`p-2 rounded ${
                    viewMode === "kanban"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
              >
                <Plus size={20} />
                Nouveau Projet
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(projectsByStatus).map(
              ([status, statusProjects]) => {
                const config = STATUS_CONFIG[status];
                const StatusIcon = config.icon;

                return (
                  <div key={status} className="flex flex-col">
                    {/* Column Header */}
                    <div
                      className={`${currentTheme.card} rounded-t-xl p-4 border-b-2 ${currentTheme.border}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={20} className={config.color} />
                          <h3 className={`font-semibold ${currentTheme.text}`}>
                            {config.label}
                          </h3>
                          <span
                            className={`text-xs bg-gray-100 ${currentTheme.textSecondary} px-2 py-1 rounded-full`}
                          >
                            {statusProjects.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column Content */}
                    <div className="bg-gray-100 rounded-b-xl p-4 min-h-[500px]">
                      {statusProjects.length > 0 ? (
                        statusProjects.map((project) => (
                          <ProjectCard key={project._id} project={project} />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <CircleDashed
                            size={48}
                            className="mx-auto mb-3 opacity-30"
                          />
                          <p className="text-sm">Aucun projet</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div
            className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Projet
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Client
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Type
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Progression
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Échéance
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Statut
                    </th>
                    <th
                      className={`px-6 py-4 text-right text-xs font-semibold ${currentTheme.text} uppercase`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${currentTheme.border}`}>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project._id}
                      className={`${currentTheme.hover} transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-medium ${currentTheme.text}`}>
                            {project.nom}
                          </p>
                          <p
                            className={`text-xs ${currentTheme.textSecondary} line-clamp-1`}
                          >
                            {project.description}
                          </p>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${currentTheme.textSecondary}`}
                      >
                        {project.client_id?.nom || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          {TYPE_LABELS[project.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${project.pourcentage_completion}%`,
                              }}
                            />
                          </div>
                          <span
                            className={`text-xs font-semibold ${currentTheme.text}`}
                          >
                            {project.pourcentage_completion}%
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${currentTheme.textSecondary}`}
                      >
                        {project.date_fin_prevue
                          ? new Date(
                              project.date_fin_prevue
                            ).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            STATUS_CONFIG[project.statut].color
                          }`}
                        >
                          {STATUS_CONFIG[project.statut].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            onClick={() => handleDelete(project._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            className={`${currentTheme.card} rounded-xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${currentTheme.border} flex-shrink-0`}
            >
              <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                {editingProject ? "Modifier le Projet" : "Nouveau Projet"}
              </h2>
              <button
                onClick={closeModal}
                className={`${currentTheme.textSecondary} hover:${currentTheme.text}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Client Selection */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Client *
                    </label>
                    <select
                      name="client_id"
                      value={values.client_id}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    >
                      <option value="">-- Sélectionner un client --</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Name */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Nom du Projet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={values.nom}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="Ex: Site web vitrine"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="Description du projet..."
                    />
                  </div>

                  {/* Type & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Type de Projet *
                      </label>
                      <select
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      >
                        <option value="site_web">Site Web</option>
                        <option value="app_mobile">App Mobile</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="autre">Autre</option>
                      </select>
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
                        <option value="devis">Devis</option>
                        <option value="en_cours">En Cours</option>
                        <option value="termine">Terminé</option>
                        <option value="annule">Annulé</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Date de Début
                      </label>
                      <input
                        type="date"
                        name="date_debut"
                        value={values.date_debut}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Date de Fin Prévue
                      </label>
                      <input
                        type="date"
                        name="date_fin_prevue"
                        value={values.date_fin_prevue}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      />
                    </div>
                  </div>

                  {/* Budget & Devis */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                      >
                        Budget (TND)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="budget"
                          value={values.budget}
                          onChange={handleChange}
                          step="0.001"
                          className={`w-full px-4 py-2 pr-16 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                          placeholder="0.000"
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
                        Lié au Devis (Optionnel)
                      </label>
                      <select
                        name="devis_id"
                        value={values.devis_id}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      >
                        <option value="">-- Aucun --</option>
                        {devisList.map((devis) => (
                          <option key={devis._id} value={devis._id}>
                            {devis.numero} - {devis.client_id?.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Progression */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Progression du Projet
                    </label>

                    <div className="space-y-3">
                      {/* Quick Selection Buttons */}
                      <div className="flex gap-2">
                        {[0, 25, 50, 75, 100].map((percentage) => (
                          <button
                            key={percentage}
                            type="button"
                            onClick={() =>
                              formik.setFieldValue(
                                "pourcentage_completion",
                                percentage
                              )
                            }
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              values.pourcentage_completion === percentage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {percentage}%
                          </button>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${values.pourcentage_completion}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-lg font-bold ${currentTheme.text} min-w-[50px] text-right`}
                        >
                          {values.pourcentage_completion}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
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
                      rows={3}
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="Notes internes, remarques..."
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    {editingProject ? "Mettre à Jour" : "Créer le Projet"}
                  </button>
                  <button
                    type="button"
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

export default Projects;
