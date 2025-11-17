"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  DollarSign,
  Calendar,
  FileText,
  Users,
  CreditCard,
  AlertCircle,
  Download,
  Filter,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const Finance = () => {
  const [theme, setTheme] = useState("light");
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeFilter, setTimeFilter] = useState("year"); // month, quarter, year, all
  const [loading, setLoading] = useState(true);

  const themes = {
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      hover: "hover:bg-gray-50",
      grid: "#e5e7eb",
      tooltip: "#ffffff",
    },
  };

  const currentTheme = themes[theme];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [facturesRes, clientsRes, projectsRes] = await Promise.all([
        axios.get("/api/facture"),
        axios.get("/api/client"),
        axios.get("/api/project"),
      ]);

      setFactures(facturesRes.data);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Calculate financial metrics
  const calculateMetrics = () => {
    // Total Revenue (all payments received)
    const totalRevenue = factures.reduce((sum, facture) => {
      const payments =
        facture.paiements?.reduce((s, p) => s + p.montant, 0) || 0;
      const acompte = facture.acompte || 0;
      return sum + payments + acompte;
    }, 0);

    // Total Invoiced (total TTC)
    const totalInvoiced = factures.reduce((sum, f) => sum + f.montant_ttc, 0);

    // Outstanding (unpaid)
    const outstanding = factures
      .filter((f) => f.statut !== "payee")
      .reduce((sum, f) => sum + (f.solde_a_payer || 0), 0);

    // Average invoice value
    const avgInvoice =
      factures.length > 0 ? totalInvoiced / factures.length : 0;

    // Payment rate
    const paymentRate =
      totalInvoiced > 0 ? (totalRevenue / totalInvoiced) * 100 : 0;

    // Overdue invoices
    const now = new Date();
    const overdueInvoices = factures.filter(
      (f) =>
        f.statut === "en_retard" ||
        (f.statut === "en_attente" && new Date(f.date_echeance) < now)
    );
    const overdueAmount = overdueInvoices.reduce(
      (sum, f) => sum + (f.solde_a_payer || 0),
      0
    );

    return {
      totalRevenue,
      totalInvoiced,
      outstanding,
      avgInvoice,
      paymentRate,
      overdueAmount,
      overdueCount: overdueInvoices.length,
    };
  };

  const metrics = calculateMetrics();

  // Monthly revenue trend
  const getMonthlyData = () => {
    const monthlyMap = {};
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    factures.forEach((facture) => {
      const date = new Date(facture.date_emission);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = `${months[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          name: monthLabel,
          invoiced: 0,
          received: 0,
          count: 0,
        };
      }

      monthlyMap[monthKey].invoiced += facture.montant_ttc;
      monthlyMap[monthKey].count += 1;

      // Add received payments
      const payments =
        facture.paiements?.reduce((s, p) => s + p.montant, 0) || 0;
      const acompte = facture.acompte || 0;
      monthlyMap[monthKey].received += payments + acompte;
    });

    return Object.values(monthlyMap)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-6); // Last 6 months
  };

  // Revenue by client
  const getRevenueByClient = () => {
    const clientMap = {};

    factures.forEach((facture) => {
      const clientName = facture.client_id?.nom || "Inconnu";
      const payments =
        facture.paiements?.reduce((s, p) => s + p.montant, 0) || 0;
      const acompte = facture.acompte || 0;
      const revenue = payments + acompte;

      if (!clientMap[clientName]) {
        clientMap[clientName] = { client: clientName, revenue: 0, count: 0 };
      }

      clientMap[clientName].revenue += revenue;
      clientMap[clientName].count += 1;
    });

    return Object.values(clientMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 clients
  };

  // Invoice status distribution
  const getStatusDistribution = () => {
    const statusMap = {
      payee: { name: "Payées", value: 0, color: "#10b981" },
      en_attente: { name: "En Attente", value: 0, color: "#f59e0b" },
      en_retard: { name: "En Retard", value: 0, color: "#ef4444" },
    };

    factures.forEach((facture) => {
      if (statusMap[facture.statut]) {
        statusMap[facture.statut].value += 1;
      }
    });

    return Object.values(statusMap).filter((s) => s.value > 0);
  };

  // Recent transactions (from payments)
  const getRecentTransactions = () => {
    const transactions = [];

    factures.forEach((facture) => {
      // Add acompte as transaction
      if (facture.acompte > 0) {
        transactions.push({
          id: `acompte-${facture._id}`,
          type: "Acompte",
          description: `Acompte - ${facture.numero}`,
          client: facture.client_id?.nom,
          amount: facture.acompte,
          date: facture.date_emission,
        });
      }

      // Add each payment
      facture.paiements?.forEach((paiement, idx) => {
        transactions.push({
          id: `${facture._id}-${idx}`,
          type: "Paiement",
          description: `${facture.numero} - ${paiement.mode_paiement}`,
          client: facture.client_id?.nom,
          amount: paiement.montant,
          date: paiement.date_paiement,
          reference: paiement.reference,
        });
      });
    });

    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Last 10 transactions
  };

  const monthlyData = getMonthlyData();
  const clientRevenue = getRevenueByClient();
  const statusDistribution = getStatusDistribution();
  const recentTransactions = getRecentTransactions();

  const financeStats = [
    {
      label: "Revenu Total",
      value: `${metrics.totalRevenue.toFixed(3)} TND`,
      icon: TrendingUp,
      color: "text-green-600",
      change: "+12.5%",
      changePositive: true,
    },
    {
      label: "À Recevoir",
      value: `${metrics.outstanding.toFixed(3)} TND`,
      icon: Clock,
      color: "text-orange-600",
      count: `${factures.filter((f) => f.statut !== "payee").length} factures`,
    },
    {
      label: "Facture Moyenne",
      value: `${metrics.avgInvoice.toFixed(3)} TND`,
      icon: FileText,
      color: "text-blue-600",
      count: `${factures.length} factures`,
    },
    {
      label: "Taux de Paiement",
      value: `${metrics.paymentRate.toFixed(1)}%`,
      icon: Percent,
      color: "text-purple-600",
      subtext: "Des factures payées",
    },
  ];

  if (loading) {
    return (
      <div
        className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={currentTheme.textSecondary}>
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
              Finances
            </h1>
            <p className={currentTheme.textSecondary}>
              Vue d'ensemble de votre activité financière
            </p>
          </div>
          <button
            className={`flex items-center gap-2 px-4 py-2 border ${currentTheme.border} rounded-lg ${currentTheme.hover} transition-colors`}
          >
            <Download size={18} />
            Exporter
          </button>
        </div>

        {/* Alert for overdue invoices */}
        {metrics.overdueCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <div>
                <p className="font-semibold text-red-800">
                  {metrics.overdueCount} facture(s) en retard
                </p>
                <p className="text-sm text-red-700">
                  Montant total: {metrics.overdueAmount.toFixed(3)} TND
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financeStats.map((stat, idx) => (
            <div
              key={idx}
              className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>
                    {stat.value}
                  </p>
                  {stat.count && (
                    <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                      {stat.count}
                    </p>
                  )}
                  {stat.subtext && (
                    <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                      {stat.subtext}
                    </p>
                  )}
                </div>
                <stat.icon strokeWidth={1} className={stat.color} size={32} />
              </div>
              {stat.change && (
                <div
                  className={`text-xs font-medium ${
                    stat.changePositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change} vs mois dernier
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div
            className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
          >
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
              Évolution Mensuelle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={currentTheme.grid}
                />
                <XAxis dataKey="name" stroke={currentTheme.textSecondary} />
                <YAxis stroke={currentTheme.textSecondary} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: currentTheme.tooltip,
                    border: `1px solid ${currentTheme.border}`,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invoiced"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Facturé"
                />
                <Line
                  type="monotone"
                  dataKey="received"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Encaissé"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Clients */}
          <div
            className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
          >
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
              Top 5 Clients
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientRevenue} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={currentTheme.grid}
                />
                <XAxis type="number" stroke={currentTheme.textSecondary} />
                <YAxis
                  type="category"
                  dataKey="client"
                  stroke={currentTheme.textSecondary}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: currentTheme.tooltip,
                    border: `1px solid ${currentTheme.border}`,
                  }}
                  formatter={(value) => `${value.toFixed(3)} TND`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Invoice Status Pie Chart */}
          <div
            className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
          >
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
              Statut des Factures
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div
              className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-blue-600">
                  {factures.length}
                </span>
              </div>
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Factures Totales
              </p>
            </div>

            <div
              className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-green-600">
                  {clients.length}
                </span>
              </div>
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Clients Actifs
              </p>
            </div>

            <div
              className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="text-purple-600" size={24} />
                <span className="text-2xl font-bold text-purple-600">
                  {factures.filter((f) => f.statut === "payee").length}
                </span>
              </div>
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Factures Payées
              </p>
            </div>

            <div
              className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="text-orange-600" size={24} />
                <span className="text-2xl font-bold text-orange-600">
                  {projects.filter((p) => p.statut === "en_cours").length}
                </span>
              </div>
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Projets En Cours
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} overflow-hidden`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
              Transactions Récentes
            </h3>
            <span className={`text-sm ${currentTheme.textSecondary}`}>
              {recentTransactions.length} dernières transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Date
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Type
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Description
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Client
                  </th>
                  <th
                    className={`px-6 py-4 text-right text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${currentTheme.border}`}>
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`${currentTheme.hover} transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {new Date(tx.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === "Paiement"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.text}`}
                    >
                      {tx.description}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {tx.client}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-semibold text-green-600`}
                    >
                      +{tx.amount.toFixed(3)} TND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
