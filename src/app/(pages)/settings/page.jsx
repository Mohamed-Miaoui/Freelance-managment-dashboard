"use client";
import React, { useEffect, useState } from "react";
import { User, Save, Lock } from "lucide-react";
import { useFormik } from "formik";
import axios from "axios";

const settings = () => {
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

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

  const { values, errors, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: {
      nom_complet: "",
      matricule_fiscal: "",
      adresse: "",
      telephone: "",
      email: "",
      rib: "",
      conditions_generales: "",
      logo_path: "",
      tva_assujetti: false,
      taux_tva: 0,
    },
    onSubmit: async (values) => {
      try {
        console.log("Form data", values);
        const settingsData = {
          ...values,
          updated_at: new Date().toISOString(),
        };

        const response = await axios.put("/api/parametere", settingsData);
        if (response) {
          alert("Settings saved successfully!");
        }
      } catch (error) {
        console.error("Error saving settings:", error);
        alert("Error saving settings!");
      }
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/parametere");
        console.log("Settings data:", response.data);

        // Update Formik values with fetched data
        setValues({
          nom_complet: response.data.nom_complet || "",
          matricule_fiscal: response.data.matricule_fiscal || "",
          adresse: response.data.adresse || "",
          telephone: response.data.telephone || "",
          email: response.data.email || "",
          rib: response.data.rib || "",
          conditions_generales: response.data.conditions_generales || "",
          logo_path: response.data.logo_path || "",
          tva_assujetti: response.data.tva_assujetti || false,
          taux_tva: response.data.taux_tva || 0,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}
      >
        <div className={`text-xl ${currentTheme.text}`}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="ml-64 p-8">
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-8`}>
          Settings
        </h1>

        <form className="px-20" icon={User} title="Profile">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  nom_complet
                </label>
                <input
                  label="nom_complet"
                  name="nom_complet"
                  value={values.nom_complet}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  placeholder="john doe"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  email
                </label>
                <input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  telephone
                </label>
                <input
                  label="telephone"
                  name="telephone"
                  type="number"
                  value={values.telephone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  placeholder="96555452"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  adresse
                </label>
                <input
                  label="adresse"
                  name="adresse"
                  value={values.adresse}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  placeholder="25 rue abd elkader"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  matricule_fiscal
                </label>
                <input
                  label="matricule_fiscal"
                  name="matricule_fiscal"
                  value={values.matricule_fiscal}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  placeholder="e.g., 123456789"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  RIB
                </label>
                <input
                  label="RIB Bancaire"
                  name="rib"
                  value={values.rib}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  placeholder="e.g., 1234 5678 9012 3456"
                />
              </div>
            </div>
            {/* <input
            label="Company Name"
            name="company"
            value={settingsData.profile.company}
            onChange={(e) => handleInputChange("profile", "company", e.target.value)}
          /> */}
            {/* <input
            label="Company Name"
            name="company"
            value={settingsData.profile.company}
            onChange={(e) => handleInputChange("profile", "company", e.target.value)}
          /> */}
          </div>
        </form>
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-8 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${currentTheme.text} mb-6`}>
            Security
          </h2>
          <ChangePasswordForm currentTheme={currentTheme} />
        </div>

        {/* <FormSection icon={Palette} title="Theme Customization">
          <div>
            <label
              className={`block text-sm font-medium ${currentTheme.text} mb-2`}
            >
              Select Theme
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`px-6 py-2 rounded-lg font-medium ${
                  theme === "light"
                    ? "bg-blue-600 text-white"
                    : `border ${currentTheme.border}`
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-6 py-2 rounded-lg font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 text-white"
                    : `border ${currentTheme.border}`
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </FormSection> */}

        {/* <FormSection icon={FileText} title="Invoice Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              label="Currency"
              name="currency"
              value={settingsData.invoice.currency}
              onChange={(e) =>
                handleInputChange("invoice", "currency", e.target.value)
              }
            />
            <input
              label="Tax Rate (%)"
              name="taxRate"
              type="number"
              value={settingsData.invoice.taxRate}
              onChange={(e) =>
                handleInputChange(
                  "invoice",
                  "taxRate",
                  parseFloat(e.target.value)
                )
              }
            />
          </div>
          <div>
            <label
              htmlFor="companyAddress"
              className={`block text-sm font-medium ${currentTheme.text} mb-2`}
            >
              Company Address (for Invoices)
            </label>
            <textarea
              name="companyAddress"
              rows="4"
              value={settingsData.invoice.companyAddress}
              onChange={(e) =>
                handleInputChange("invoice", "companyAddress", e.target.value)
              }
              className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
            ></textarea>
          </div>
        </FormSection> */}

        {/* <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
          >
            <Save size={18} />
            Save Changes
          </button>
        </div> */}
      </div>
    </div>
  );
};

const ChangePasswordForm = ({ currentTheme }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password updated successfully" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
            required
          />
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all disabled:opacity-50`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default settings;
