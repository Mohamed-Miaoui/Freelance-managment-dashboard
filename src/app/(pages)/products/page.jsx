"use client";
import React, { useState } from "react";
import {
  Plus,
  Package,
  Settings,
  ShoppingCart,
  Moon,
  Sun,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  ChevronDown,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const products = () => {
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Widget",
      category: "UI Component",
      price: 49.99,
      stock: 120,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop",
      status: "active",
      sku: "WGT-001",
    },
    {
      id: 2,
      name: "Dashboard Template",
      category: "Template",
      price: 99.99,
      stock: 45,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
      status: "active",
      sku: "TPL-002",
    },
    {
      id: 3,
      name: "API Integration Plugin",
      category: "Plugin",
      price: 79.99,
      stock: 80,
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop",
      status: "active",
      sku: "PLG-003",
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1001,
      customer: "John Smith",
      email: "john@example.com",
      product: "Premium Widget",
      quantity: 2,
      total: 99.98,
      status: "completed",
      date: "2024-11-01",
    },
    {
      id: 1002,
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      product: "Dashboard Template",
      quantity: 1,
      total: 99.99,
      status: "pending",
      date: "2024-11-03",
    },
    {
      id: 1003,
      customer: "Mike Davis",
      email: "mike@example.com",
      product: "API Integration Plugin",
      quantity: 3,
      total: 239.97,
      status: "processing",
      date: "2024-11-04",
    },
    {
      id: 1004,
      customer: "Emily Chen",
      email: "emily@example.com",
      product: "Premium Widget",
      quantity: 1,
      total: 49.99,
      status: "cancelled",
      date: "2024-11-02",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [activeView, setActiveView] = useState("products");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    status: "active",
    sku: "",
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
      sidebar: "bg-white border-r border-gray-200",
      tableHeader: "bg-gray-50",
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
      tableHeader: "bg-gray-700",
    },
    purple: {
      bg: "bg-purple-50",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-purple-600",
      border: "border-purple-200",
      hover: "hover:bg-purple-50",
      primary: "bg-purple-600 hover:bg-purple-700",
      sidebar: "bg-white border-r border-purple-200",
      tableHeader: "bg-purple-50",
    },
    ocean: {
      bg: "bg-cyan-50",
      card: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-cyan-600",
      border: "border-cyan-200",
      hover: "hover:bg-cyan-50",
      primary: "bg-cyan-600 hover:bg-cyan-700",
      sidebar: "bg-white border-r border-cyan-200",
      tableHeader: "bg-cyan-50",
    },
  };

  const currentTheme = themes[theme];
  const categories = ["UI Component", "Template", "Plugin", "Service", "API"];

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock ||
      !formData.image ||
      !formData.sku
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...formData,
                id: editingProduct.id,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
              }
            : p
        )
      );
    } else {
      setProducts([
        ...products,
        {
          ...formData,
          id: Date.now(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      image: "",
      status: "active",
      sku: "",
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setShowOrderModal(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toString().includes(searchTerm);
    const matchesStatus =
      orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const productStats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Active Products",
      value: products.filter((p) => p.status === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Filter,
      color: "text-purple-600",
    },
    {
      label: "Total Value",
      value: `$${products
        .reduce((sum, p) => sum + p.price * p.stock, 0)
        .toFixed(2)}`,
      icon: Settings,
      color: "text-orange-600",
    },
  ];

  const orderStats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Revenue",
      value: `$${orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total, 0)
        .toFixed(2)}`,
      icon: Package,
      color: "text-purple-600",
    },
  ];

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const stats = activeView === "products" ? productStats : orderStats;

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      {/* Main Content */}
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
                <stat.icon
                  strokeWidth={1}
                  className={`${stat.color}`}
                  size={32}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Products View */}

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
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                />
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-6 py-2 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
              >
                <Plus strokeWidth={1} size={20} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div
          className={`${currentTheme.card} rounded-xl shadow-sm border ${currentTheme.border} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${currentTheme.tableHeader}`}>
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Product
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    SKU
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Category
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Price
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-semibold ${currentTheme.text} uppercase tracking-wider`}
                  >
                    Stock
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
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`${currentTheme.hover} transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span
                          className={`ml-3 font-medium ${currentTheme.text}`}
                        >
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {product.sku}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {product.category}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${currentTheme.text}`}
                    >
                      ${product.price}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.textSecondary}`}
                    >
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleEdit(product)}
                        className={`${currentTheme.textSecondary} hover:text-blue-600 mr-3 transition-colors`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
              className={`${currentTheme.card} rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
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
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="e.g., WGT-001"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${currentTheme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.card} ${currentTheme.text}`}
                    placeholder="https://example.com/image.jpg"
                  />
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 px-6 py-3 ${currentTheme.primary} text-white rounded-lg font-medium transition-all hover:shadow-lg`}
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
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

export default products;
