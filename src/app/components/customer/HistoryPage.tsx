import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, RefreshCw, Package, ShoppingBag } from "lucide-react";
import { useOrders } from "../../context/OrderContext";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:           { label: "Pending",          color: "text-yellow-600", bg: "bg-yellow-50",   border: "border-yellow-200" },
  confirmed:         { label: "Confirmed",         color: "text-blue-600",   bg: "bg-blue-50",     border: "border-blue-200" },
  preparing:         { label: "Preparing",         color: "text-orange-600", bg: "bg-orange-50",   border: "border-orange-200" },
  out_for_delivery:  { label: "On The Way",        color: "text-purple-600", bg: "bg-purple-50",   border: "border-purple-200" },
  delivered:         { label: "Delivered ✓",       color: "text-green-600",  bg: "bg-green-50",    border: "border-green-200" },
  cancelled:         { label: "Cancelled ✗",       color: "text-red-500",    bg: "bg-red-50",      border: "border-red-200" },
};

export function HistoryPage() {
  const navigate = useNavigate();
  const { myOrders, ordersLoading, fetchMyOrders } = useOrders();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 py-6 flex items-center gap-4 border-b border-gray-100/50 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90"
        >
          <ArrowLeft size={20} className="text-shrimart-black" />
        </button>
        <div>
          <h2 className="font-bold text-shrimart-black text-[22px] uppercase tracking-tight font-poppins">Order History</h2>
          <p className="text-[12px] font-normal text-gray-400 uppercase tracking-widest mt-0.5 font-inter">
            {myOrders.length} past orders
          </p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {ordersLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-shrimart-yellow border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-inter">Loading Orders...</p>
          </div>
        ) : myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <ShoppingBag size={40} className="text-slate-300" />
            <p className="font-bold text-shrimart-black text-sm uppercase tracking-widest font-inter">No Orders Yet</p>
            <button
              onClick={() => navigate("/customer")}
              className="bg-shrimart-yellow text-shrimart-black px-6 py-3 rounded-full text-sm font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          myOrders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            return (
              <motion.div
                key={order.id}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4 font-inter">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="font-bold text-shrimart-black text-[15px] uppercase tracking-tight font-poppins">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-2xl border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 font-inter">
                    {order.order_items?.map((item, j) => (
                      <span key={j} className="text-[10px] font-bold bg-slate-50 text-shrimart-black/50 px-3 py-1.5 rounded-xl border border-gray-100 uppercase">
                        {item.quantity}× {item.product_name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-slate-50 font-inter">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</span>
                      <span className="font-bold text-shrimart-black text-[22px]">₹{order.total_amount}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {order.payment_method}
                      </span>
                      {order.status === "delivered" && (
                        <button
                          className="w-12 h-12 bg-shrimart-yellow rounded-2xl flex items-center justify-center shadow-glow hover:bg-shrimart-yellow-dark transition-all active:scale-90"
                          onClick={() => navigate("/customer")}
                          title="Reorder"
                        >
                          <RefreshCw size={18} className="text-shrimart-black" />
                        </button>
                      )}
                      {["pending", "confirmed", "preparing", "out_for_delivery"].includes(order.status) && (
                        <button
                          className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 active:scale-90"
                          onClick={() => navigate(`/customer/tracking?order=${order.id}`)}
                          title="Track"
                        >
                          <Package size={18} className="text-blue-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
