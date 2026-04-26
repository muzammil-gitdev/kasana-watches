"use client";

import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";

const mockOrders = [
  {
    id: "KW-20260001",
    customer: "Ahmed Khan",
    email: "ahmed@email.com",
    product: "Chronograph Elite",
    category: "men",
    quantity: 1,
    total: 24999,
    status: "delivered",
    date: "2026-04-20",
    paymentMethod: "Credit Card",
  },
  {
    id: "KW-20260002",
    customer: "Sara Ali",
    email: "sara@email.com",
    product: "Rose Gold Elegance",
    category: "women",
    quantity: 1,
    total: 22999,
    status: "shipped",
    date: "2026-04-22",
    paymentMethod: "JazzCash",
  },
  {
    id: "KW-20260003",
    customer: "Hassan Raza",
    email: "hassan@email.com",
    product: "Eternal Bond Set",
    category: "couples",
    quantity: 1,
    total: 45999,
    status: "processing",
    date: "2026-04-24",
    paymentMethod: "EasyPaisa",
  },
  {
    id: "KW-20260004",
    customer: "Fatima Noor",
    email: "fatima@email.com",
    product: "Diamond Luxe",
    category: "women",
    quantity: 1,
    total: 65999,
    status: "pending",
    date: "2026-04-25",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "KW-20260005",
    customer: "Bilal Sheikh",
    email: "bilal@email.com",
    product: "Royal Automatic",
    category: "men",
    quantity: 2,
    total: 85998,
    status: "delivered",
    date: "2026-04-18",
    paymentMethod: "Credit Card",
  },
  {
    id: "KW-20260006",
    customer: "Ayesha Malik",
    email: "ayesha@email.com",
    product: "Sapphire Dream",
    category: "women",
    quantity: 1,
    total: 48999,
    status: "shipped",
    date: "2026-04-23",
    paymentMethod: "COD",
  },
  {
    id: "KW-20260007",
    customer: "Usman Ghani",
    email: "usman@email.com",
    product: "Carbon Noir",
    category: "men",
    quantity: 1,
    total: 38999,
    status: "delivered",
    date: "2026-04-15",
    paymentMethod: "Credit Card",
  },
  {
    id: "KW-20260008",
    customer: "Zainab Tariq",
    email: "zainab@email.com",
    product: "Classic Duo",
    category: "couples",
    quantity: 1,
    total: 38999,
    status: "processing",
    date: "2026-04-25",
    paymentMethod: "JazzCash",
  },
];

const statusConfig = {
  placed: {
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    label: "Placed",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    label: "Pending",
  },
  processing: {
    icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    label: "Delivered",
  },
};

function formatPrice(price) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const items = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format for table
        customer: `${doc.data().customerInfo?.firstName} ${doc.data().customerInfo?.lastName}`,
        email: doc.data().customerInfo?.email,
        product: doc.data().items?.[0]?.name + (doc.data().items?.length > 1 ? ` + ${doc.data().items.length - 1} more` : ""),
        category: doc.data().items?.[0]?.category,
        quantity: doc.data().items?.reduce((s, i) => s + i.quantity, 0),
        date: doc.data().createdAt?.toDate() || new Date(),
        paymentMethod: "COD" // Currently only COD
      }));
      setOrders(items);
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      await fetchOrders();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    placed: orders.filter((o) => o.status === "placed").length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-white/5 rounded-lg" />
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white/5 rounded-lg" />
          ))}
        </div>
        <div className="h-12 w-full bg-white/5 rounded-xl" />
        <div className="h-96 w-full bg-white/5 rounded-2xl border border-white/10" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">
          Track and manage customer orders
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: "all", label: "All Orders" },
          ...Object.entries(statusConfig).map(([key, val]) => ({
            key,
            label: val.label,
          })),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              statusFilter === tab.key
                ? "bg-gold/10 border-gold/30 text-gold"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {tab.label}{" "}
            <span className="ml-1 opacity-60">({statusCounts[tab.key]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl">
        <div className="overflow-x-auto pb-40">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Order ID
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Customer
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Product
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Total
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Date
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium px-6 py-4">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors hover:relative hover:z-20"
                  >
                    <td className="px-6 py-4">
                      <span className="text-gold font-mono text-sm">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm font-medium">
                          {order.customer}
                        </p>
                        <p className="text-gray-500 text-xs">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm">{order.product}</p>
                        <p className="text-gray-500 text-xs capitalize">
                          {order.category} · Qty {order.quantity}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium text-sm">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group/status">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${status?.bg || "bg-white/5"} ${status?.color || "text-white"} ${status?.border || "border-white/10"}`}
                        >
                          <StatusIcon size={12} />
                          {status?.label || "Unknown"}
                        </span>
                        
                        {/* Status Quick Select */}
                        <div className="absolute left-0 top-full mt-1 hidden group-hover/status:block z-50 bg-charcoal border border-white/10 rounded-lg shadow-xl p-1 min-w-[120px]">
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <button
                              key={key}
                              onClick={() => handleUpdateStatus(order.id, key)}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                            >
                              {config.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(order.date).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {order.paymentMethod}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
