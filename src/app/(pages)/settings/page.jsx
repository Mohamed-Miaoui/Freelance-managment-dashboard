"use client";
import React, { useState } from "react";
import { User, Palette, FileText, Building, Save } from "lucide-react";

const settings = () => {
  const [theme, setTheme] = useState("light");
  const [settingsData, setSettingsData] = useState({
    profile: {
      name: "Freelancer Name",
      email: "freelancer@example.com",
      company: "My Freelance Co.",
    },
    invoice: {
      currency: "USD",
      taxRate: 8.5,
      companyAddress: "123 Freelance St.\nYour City, YS 12345",
    },
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

  const handleInputChange = (section, field, value) => {
    setSettingsData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Here you would typically send the data to a server
    console.log("Saving settings:", settingsData);
    alert("Settings saved successfully!");
  };

  const FormSection = ({ icon: Icon, title, children }) => (
    <div className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} mb-8`}>
      <div className="p-6 border-b ${currentTheme.border}">
        <div className="flex items-center gap-3">
          <Icon className={currentTheme.textSecondary} size={20} />
          <h3 className={`text-lg font-semibold ${currentTheme.text}`}>{title}</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  const InputField = ({ label, id, value, onChange, type = "text", placeholder }) => (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium ${currentTheme.text} mb-2`}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
      />
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}>
      <div className="ml-64 p-8">
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-8`}>Settings</h1>

        <FormSection icon={User} title="Profile">
          <InputField
            label="Full Name"
            id="name"
            value={settingsData.profile.name}
            onChange={(e) => handleInputChange("profile", "name", e.target.value)}
          />
          <InputField
            label="Email Address"
            id="email"
            type="email"
            value={settingsData.profile.email}
            onChange={(e) => handleInputChange("profile", "email", e.target.value)}
          />
          <InputField
            label="Company Name"
            id="company"
            value={settingsData.profile.company}
            onChange={(e) => handleInputChange("profile", "company", e.target.value)}
          />
        </FormSection>

        <FormSection icon={Palette} title="Theme Customization">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Select Theme</label>
            <div className="flex gap-3">
              <button onClick={() => setTheme('light')} className={`px-6 py-2 rounded-lg font-medium ${theme === 'light' ? 'bg-blue-600 text-white' : `border ${currentTheme.border}`}`}>Light</button>
              <button onClick={() => setTheme('dark')} className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-blue-600 text-white' : `border ${currentTheme.border}`}`}>Dark</button>
            </div>
          </div>
        </FormSection>

        <FormSection icon={FileText} title="Invoice Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Currency"
              id="currency"
              value={settingsData.invoice.currency}
              onChange={(e) => handleInputChange("invoice", "currency", e.target.value)}
            />
            <InputField
              label="Tax Rate (%)"
              id="taxRate"
              type="number"
              value={settingsData.invoice.taxRate}
              onChange={(e) => handleInputChange("invoice", "taxRate", parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Company Address (for Invoices)</label>
            <textarea
              id="companyAddress"
              rows="4"
              value={settingsData.invoice.companyAddress}
              onChange={(e) => handleInputChange("invoice", "companyAddress", e.target.value)}
              className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
            ></textarea>
          </div>
        </FormSection>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default settings;
