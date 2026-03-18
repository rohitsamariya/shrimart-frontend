import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Minus, ShoppingBag, Trash2, Tag, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

export function CartPage() {
  const navigate = useNavigate();
  const { items, addToCart, removeFromCart, clearCart, cartTotal, cartCount, loading } = useCart();

  const delivery = cartTotal >= 199 ? 0 : 20;
  const total = cartTotal + delivery;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-shrimart-yellow animate-spin" />
        <p className="font-bold text-shrimart-black uppercase tracking-widest font-inter">Loading basket...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 py-6 flex items-center gap-4 border-b border-gray-100/50 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90"
        >
          <ArrowLeft size={20} className="text-shrimart-black" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-shrimart-black text-[22px] uppercase tracking-tight truncate font-poppins">Basket</h2>
          <p className="text-[12px] font-normal text-gray-400 uppercase tracking-widest mt-0.5 font-inter">{cartCount} items selected</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all active:scale-90"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-9xl mb-10 drop-shadow-2xl"
          >
            🛒
          </motion.div>
          <h3 className="text-[26px] font-bold text-shrimart-black mb-3 font-poppins">Empty Basket?</h3>
          <p className="text-gray-400 font-normal mb-10 font-inter">Your basket is feeling lonely. Add some fresh groceries!</p>
          <button
            className="w-full max-w-xs bg-shrimart-yellow text-shrimart-black py-5 rounded-[2rem] font-semibold text-[16px] uppercase shadow-glow hover:bg-shrimart-yellow-dark transition-all active:scale-95 font-inter"
            onClick={() => navigate("/customer")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="px-6 py-8 space-y-6">
          {/* Free delivery promo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[2rem] px-6 py-5 flex items-center gap-4 border ${
              cartTotal >= 199
                ? "bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]"
                : "bg-shrimart-yellow-light/50 border-shrimart-yellow/20 text-shrimart-black"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cartTotal >= 199 ? "bg-[#10B981] text-white" : "bg-shrimart-yellow text-shrimart-black"}`}>
              {cartTotal >= 199 ? <CheckCircle size={18} /> : <Tag size={18} />}
            </div>
            <div className="flex-1 font-inter">
              {cartTotal >= 199 ? (
                <p className="text-[14px] font-bold">Yay! You've unlocked FREE delivery ⚡</p>
              ) : (
                <p className="text-[14px] font-medium">Add <span className="font-bold text-shrimart-yellow-dark">₹{199 - cartTotal}</span> more for FREE delivery!</p>
              )}
            </div>
          </motion.div>

          {/* Cart Items */}
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 font-inter">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Items In Basket</span>
            </div>
            <AnimatePresence>
              {items.map((item, idx) => {
                const p = item.products;
                if (!p) return null;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-4 px-6 py-6 ${idx < items.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        : <ShoppingBag size={24} className="text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0 font-inter">
                      <p className="font-semibold text-shrimart-black text-[17px] truncate">{p.name}</p>
                      <p className="text-[12px] font-normal text-gray-400 mt-1">₹{p.price} each</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-1 shadow-inner">
                      <button
                        className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                        onClick={() => removeFromCart(Number(p.id))}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-shrimart-black w-6 text-center text-[16px] font-inter">{item.quantity}</span>
                      <button
                        className="w-8 h-8 bg-shrimart-yellow rounded-xl flex items-center justify-center shadow-sm hover:bg-shrimart-yellow-dark transition-all active:scale-90"
                        onClick={() => addToCart(Number(p.id))}
                      >
                        <Plus size={14} className="text-shrimart-black" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bill details */}
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-6 sm:p-8 space-y-4 font-inter">
            <h3 className="font-bold text-[18px] uppercase tracking-tight font-poppins">Bill Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Basket Total</span>
                <span className="font-bold text-[16px]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Delivery</span>
                <span className={`font-bold text-[16px] ${delivery === 0 ? "text-[#10B981]" : ""}`}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <div>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="font-bold text-[32px] font-poppins">₹{total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout sticky CTA */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent -top-12 pointer-events-none" />
            <div className="bg-white px-6 pb-10 pt-2 relative">
              <motion.button
                className="w-full max-w-md mx-auto bg-shrimart-yellow text-shrimart-black py-4 rounded-[2rem] font-bold text-[16px] uppercase flex items-center justify-between px-8 shadow-glow hover:bg-shrimart-yellow-dark transition-all active:scale-95 font-inter"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/customer/address")}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={22} />
                  <span>Confirm Order</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm border-l border-shrimart-black/20 pl-4 pr-1 font-bold">₹{total.toFixed(2)}</span>
                  <ChevronRight size={20} />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
