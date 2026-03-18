import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Plus, Minus, CheckCircle, Clock, XCircle,
  Eye, Edit, Trash2, BarChart3, Bike, TrendingUp,
  ShoppingCart, Package, LogOut, Bell, Search, ChevronDown, Filter, RefreshCw,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

type Tab = "dashboard" | "orders" | "products" | "riders";

const statusColors: Record<string, string> = {
  delivered:          "bg-green-100 text-green-600",
  out_for_delivery:   "bg-blue-100 text-blue-600",
  preparing:          "bg-yellow-100 text-yellow-700",
  confirmed:          "bg-indigo-100 text-indigo-600",
  pending:            "bg-orange-100 text-orange-600",
  cancelled:          "bg-red-100 text-red-500",
};

const STATUS_OPTIONS = ["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"];

const revenueData = [
  { day: "Mon", revenue: 1200, orders: 28 },
  { day: "Tue", revenue: 1800, orders: 42 },
  { day: "Wed", revenue: 1400, orders: 33 },
  { day: "Thu", revenue: 2100, orders: 51 },
  { day: "Fri", revenue: 2600, orders: 62 },
  { day: "Sat", revenue: 3100, orders: 74 },
  { day: "Sun", revenue: 2800, orders: 67 },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");

  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders });
      const data = await res.json();
      if (data.status === "success") setOrders(data.data || []);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.status === "success") setProducts(data.data || []);
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { if (tab === "products") fetchProducts(); }, [tab, fetchProducts]);

  const updateStatus = async (order_id: string, status: string) => {
    setUpdatingId(order_id);
    try {
      await fetch(`${API_BASE}/admin/order-status`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ order_id, status }),
      });
      await fetchOrders();
    } catch (e) {
      console.error("Failed to update order status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API_BASE}/products/${id}`, { method: "DELETE", headers: authHeaders });
    fetchProducts();
  };

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => !["delivered","cancelled"].includes(o.status)).length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: <ShoppingCart size={22} />, color: "bg-blue-50 text-blue-500" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={22} />, color: "bg-green-50 text-green-600" },
    { label: "Pending", value: pendingOrders.toString(), icon: <Clock size={22} />, color: "bg-yellow-50 text-yellow-600" },
    { label: "Delivered", value: deliveredOrders.toString(), icon: <CheckCircle size={22} />, color: "bg-purple-50 text-purple-500" },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  const tabItems = [
    { id: "dashboard" as Tab, icon: <BarChart3 size={20} />, label: "Dashboard" },
    { id: "orders" as Tab, icon: <ShoppingCart size={20} />, label: "Orders" },
    { id: "products" as Tab, icon: <Package size={20} />, label: "Inventory" },
    { id: "riders" as Tab, icon: <Bike size={20} />, label: "Riders" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Top Nav */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-shrimart-yellow rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-[26px] font-bold text-shrimart-black font-poppins">S</span>
          </div>
          <div>
            <h1 className="font-bold text-shrimart-black text-[20px] uppercase tracking-tight leading-none font-poppins">ShriMart</h1>
            <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mt-0.5 font-inter">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 bg-shrimart-black px-4 py-2 rounded-2xl font-inter">
            <div className="w-7 h-7 bg-shrimart-yellow rounded-xl flex items-center justify-center text-xs font-bold text-shrimart-black">A</div>
            <span className="text-[12px] font-bold text-white">{user?.email || "Admin"}</span>
          </div>
          <button onClick={() => fetchOrders()} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100">
            <RefreshCw size={16} className="text-gray-500" />
          </button>
          <button onClick={handleLogout} className="w-10 h-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-white min-h-screen border-r border-gray-100 pt-8 px-4 sticky top-20 h-[calc(100vh-80px)] font-inter">
          <div className="space-y-2">
            {tabItems.map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-tight transition-all font-inter ${tab === item.id ? "bg-shrimart-black text-shrimart-yellow" : "text-gray-400 hover:text-shrimart-black hover:bg-slate-50"}`}
                onClick={() => setTab(item.id)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 bg-shrimart-black/95 backdrop-blur-xl rounded-[2rem] px-6 py-4 flex items-center justify-around font-inter">
          {tabItems.map(item => (
            <button key={item.id} className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${tab === item.id ? "text-shrimart-yellow" : "text-gray-500"}`} onClick={() => setTab(item.id)}>
              {item.icon}
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">

          {/* ── DASHBOARD ── */}
          {tab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-[22px] font-bold text-shrimart-black uppercase tracking-tighter font-poppins">Command Center</h2>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 font-inter">Live Data</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3 }}>
                    <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>{stat.icon}</div>
                    <div className="font-bold text-shrimart-black text-[24px] tracking-tighter leading-none">{stat.value}</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 font-inter">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-shrimart-black uppercase text-[16px] mb-6 font-poppins">Weekly Revenue</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={revenueData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: "#9CA3AF" }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: "#000", border: "none", borderRadius: 12 }} itemStyle={{ color: "#FFD84D", fontSize: 10 }} formatter={(v: number) => [`₹${v}`, "Revenue"]} labelStyle={{ display: "none" }} />
                      <Bar dataKey="revenue" fill="#FFD84D" radius={[6, 6, 6, 6]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-shrimart-black uppercase text-[16px] mb-6 font-poppins">Order Volume</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: "#9CA3AF" }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: "#000", border: "none", borderRadius: 12 }} itemStyle={{ color: "#10B981", fontSize: 10 }} formatter={(v) => [v, "Orders"]} labelStyle={{ display: "none" }} />
                      <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 4 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Recent Orders mini-table */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-gray-50">
                  <h3 className="font-bold text-shrimart-black uppercase text-[16px] font-poppins">Recent Orders</h3>
                  <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-shrimart-black font-inter" onClick={() => setTab("orders")}>View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 font-inter">
                        {["Order ID", "Customer", "Amount", "Status"].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-slate-50/30 transition-all font-inter">
                          <td className="px-6 py-4 text-sm font-bold text-shrimart-black uppercase">#{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-[13px] font-medium text-shrimart-black">{order.users?.name || order.users?.phone_number || "—"}</td>
                          <td className="px-6 py-4 text-sm font-bold text-shrimart-black">₹{order.total_amount}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl inline-flex items-center gap-1.5 ${statusColors[order.status] || "bg-gray-100 text-gray-500"}`}>
                              <span className="w-1 h-1 rounded-full bg-current" />{order.status?.replace(/_/g, " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-[22px] font-bold text-shrimart-black uppercase tracking-tighter font-poppins">All Orders</h2>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 font-inter">{orders.length} total orders</p>
                </div>
                <button onClick={fetchOrders} className="flex items-center gap-2 bg-shrimart-black text-shrimart-yellow px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest font-inter active:scale-95">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-shrimart-yellow border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 font-inter">
                          {["Order ID", "Customer", "Items", "Amount", "Status", "Actions"].map(h => (
                            <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-slate-50/30 transition-all font-inter">
                            <td className="px-6 py-4 text-sm font-bold text-shrimart-black uppercase whitespace-nowrap">#{order.id.slice(0, 8)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-[13px] font-bold text-shrimart-black">{order.users?.name || "—"}</p>
                              <p className="text-[10px] text-gray-400">{order.users?.phone_number}</p>
                            </td>
                            <td className="px-6 py-4 text-[11px] text-gray-500 max-w-[160px] truncate">
                              {order.order_items?.map((i: any) => i.product_name).join(", ") || "—"}
                            </td>
                            <td className="px-6 py-4 font-bold text-shrimart-black whitespace-nowrap">₹{order.total_amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                disabled={updatingId === order.id}
                                onChange={e => updateStatus(order.id, e.target.value)}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border-none outline-none cursor-pointer ${statusColors[order.status] || "bg-gray-100 text-gray-500"}`}
                              >
                                {STATUS_OPTIONS.map(s => (
                                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-shrimart-yellow transition-all">
                                  <Eye size={13} className="text-gray-400" />
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
            </motion.div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === "products" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[22px] font-bold text-shrimart-black uppercase tracking-tighter font-poppins">Inventory</h2>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 font-inter">{products.length} products in DB</p>
                </div>
              </div>
              {productsLoading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-shrimart-yellow border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map(product => (
                    <motion.div key={product.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all" whileHover={{ y: -4 }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={24} className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all" onClick={() => deleteProduct(product.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-shrimart-black text-[16px] mb-1 font-poppins">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4 font-inter">
                        <span className="text-[10px] font-bold bg-shrimart-black text-shrimart-yellow px-3 py-1 rounded-lg uppercase">{product.description || "—"}</span>
                        <span className="font-bold text-shrimart-black text-[20px]">₹{product.price}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 font-inter">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</p>
                          <p className={`text-[13px] font-bold ${(product.stock || 0) < 10 ? "text-red-500" : "text-green-600"}`}>{product.stock ?? "—"} units</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${(product.stock || 0) > 0 ? "bg-green-500" : "bg-red-500"} shadow-sm animate-pulse`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── RIDERS ── */}
          {tab === "riders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold text-shrimart-black uppercase tracking-tighter font-poppins">Riders</h2>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 font-inter">Delivery team overview</p>
              </div>
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
                <Bike size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="font-bold text-gray-400 text-sm uppercase tracking-widest font-inter">Rider management coming soon</p>
                <p className="text-gray-300 text-xs mt-2 font-inter">Add riders via the riders table in Supabase and they will appear here</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}