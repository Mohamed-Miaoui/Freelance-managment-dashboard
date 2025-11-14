"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Settings,
  ShoppingCart,
  Bell,
  User,
  File,
  FileArchive,
  CircleDollarSignIcon,
  Briefcase,
} from "lucide-react";

export default function Layout({ children }) {
  const pathname = usePathname();
  const activeView = pathname.split("/").pop();

  const [theme, setTheme] = useState("light");
  const themes = {
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      hover: "hover:bg-gray-50",
      primary: "bg-blue-600 hover:bg-blue-700",
      sidebar: "bg-white border-r border-gray-200",
    },
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-white",
      textSecondary: "text-gray-400",
      border: "border-gray-700",
      hover: "hover:bg-gray-700",
      primary: "bg-blue-600 hover:bg-blue-700",
      sidebar: "bg-gray-800 border-r border-gray-700",
    },
  };

  const currentTheme = themes[theme];

  const navLinks = [
    { href: "/clients", icon: User, label: "Clients" },
    { href: "/projects", icon: Briefcase, label: "Projects" },
    { href: "/devis", icon: File, label: "Devis" },
    { href: "/invoices", icon: FileArchive, label: "Invoices" },
    { href: "/finance", icon: CircleDollarSignIcon, label: "Finance" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 ${currentTheme.sidebar} transition-colors duration-300 z-10`}
      >
        <div className="p-6">
          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-8`}>
            Admin Hub
          </h1>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === link.href.substring(1)
                    ? `${currentTheme.primary} text-white`
                    : `${currentTheme.text} ${currentTheme.hover}`
                }`}
              >
                <link.icon strokeWidth={1} size={20} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="absolute top-5 right-5">
          <button className="relative p-2.5 hover:bg-gray-50 rounded-full transition-all group cursor-pointer">
            <Link href="/espace-personnel/notifications">
              <Bell
                className="w-6 h-6 text-gray-600 group-hover:text-amber-500 group-hover:scale-110 transition-all"
                strokeWidth={1.5}
              />
            </Link>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
        <div className="max-w-ull mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
