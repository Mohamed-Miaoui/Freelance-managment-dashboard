/* 
  NOTE: This page uses the 'recharts' library for charts. 
  Please install it by running: npm install recharts
*/
"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  DollarSign,
  Calendar,
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
} from "recharts";

const finance = () => {
  const [theme, setTheme] = useState("light");

  const themes = {
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      grid: "#e5e7eb",
      tooltip: "#ffffff",
    },
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-white",
      textSecondary: "text-gray-400",
      border: "border-gray-700",
      grid: "#4b5563",
      tooltip: "#1f2937",
    },
  };

  const currentTheme = themes[theme];

  const monthlyData = [
    { name: "Jan", income: 4000, expenses: 2400 },
    { name: "Feb", income: 3000, expenses: 1398 },
    { name: "Mar", income: 5000, expenses: 3800 },
    { name: "Apr", income: 4780, expenses: 3908 },
    { name: "May", income: 5890, expenses: 4800 },
    { name: "Jun", income: 4390, expenses: 3800 },
  ];

  const clientRevenue = [
    { client: "Doe Corp", revenue: 21000 },
    { client: "Smith & Co.", revenue: 12200 },
    { client: "Johnson Inc.", revenue: 4700 },
    { client: "Other", revenue: 8300 },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "Income",
      description: "Invoice #INV-2024-001 Paid",
      amount: 2500,
      date: "2024-11-05",
    },
    {
      id: 2,
      type: "Expense",
      description: "Software Subscription",
      amount: -99,
      date: "2024-11-04",
    },
    {
      id: 3,
      type: "Income",
      description: "Project Milestone Payment",
      amount: 4000,
      date: "2024-11-02",
    },
    {
      id: 4,
      type: "Expense",
      description: "Office Supplies",
      amount: -150,
      date: "2024-11-01",
    },
  ];

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce(
    (sum, item) => sum + item.expenses,
    0
  );
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const financeStats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Total Expenses",
      value: `$${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      label: "Net Profit",
      value: `$${netProfit.toLocaleString()}`,
      icon: Scale,
      color: "text-blue-600",
    },
    {
      label: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      icon: Percent,
      color: "text-purple-600",
    },
  ];

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="ml-64 p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financeStats.map((stat, idx) => (
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
          >
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
              Income vs. Expenses
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
                <Legend wrapperStyle={{ color: currentTheme.text }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className={`${currentTheme.card} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}
          >
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
              Revenue by Client
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
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: currentTheme.tooltip,
                    border: `1px solid ${currentTheme.border}`,
                  }}
                  cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} overflow-hidden`}
        >
          <h3 className={`text-lg font-semibold ${currentTheme.text} p-6`}>
            Recent Transactions
          </h3>
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
                    Description
                  </th>
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
                    className={`px-6 py-4 text-right text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Amount
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
                      className={`px-6 py-4 whitespace-nowrap font-medium ${currentTheme.text}`}
                    >
                      {tx.description}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {tx.date}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === "Income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}$
                      {Math.abs(tx.amount).toLocaleString()}
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

export default finance;
