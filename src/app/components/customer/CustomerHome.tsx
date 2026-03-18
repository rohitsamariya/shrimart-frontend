import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, Plus, Minus, Star, ChevronRight, Zap, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";

export function CustomerHome() {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getQty } = useCart();
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category || "General")))];

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-shrimart-yellow animate-spin" />
        <p className="font-bold text-shrimart-black uppercase tracking-widest font-inter">Loading fresh items...</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 pb-24 space-y-10">
      {/* Search Bar - Matches Screenshot */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-[1.5rem] px-6 py-4 shadow-sm">
          <Search size={20} className="text-slate-400" />
          <input
            className="flex-1 text-[15px] font-medium outline-none text-shrimart-black placeholder:text-slate-400 bg-transparent font-inter"
            placeholder="Search groceries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories - Circular Layout - Matches Screenshot */}
      <div className="space-y-4">
        <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6">
          {categories.map((c) => {
            let categoryEmoji = products.find(p => p.category === c)?.emoji || "📦";
            let categoryImage = null;
            if (c === "Vegetables") categoryImage = "/src/assets/categories/vegetables.png";
            else if (c === "Fruits") categoryImage = "/src/assets/products/oranges.png";
            else if (c === "Dairy") categoryImage = "/src/assets/products/milk.png";
            else if (c === "Snacks") categoryEmoji = "🥨";
            
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c || "General")}
                className="flex flex-col items-center gap-3 flex-shrink-0 group"
              >
                <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl transition-all border ${
                  selectedCategory === c 
                    ? "bg-white border-[#E6C340] scale-105 shadow-md" 
                    : "bg-[#F8F9FA] border-transparent"
                } overflow-hidden shadow-sm`}>
                  {categoryImage ? (
                    <img src={categoryImage} alt={c} className="w-full h-full object-cover p-2" />
                  ) : (
                    <span className="grayscale-[0.2] transition-all group-hover:grayscale-0">
                      {categoryEmoji}
                    </span>
                  )}
                </div>
                <span className={`text-[13px] font-bold font-inter ${
                  selectedCategory === c ? "text-[#002D3A]" : "text-slate-400"
                }`}>
                  {c}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Section - Matches Screenshot Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-[#002D3A] text-[20px] font-poppins tracking-tight">Popular Near You</h3>
          <button className="text-[#FED847] hover:text-[#E6C340] text-[13px] font-bold font-inter">View all</button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="text-4xl grayscale">🔍</div>
            <p className="font-bold text-shrimart-black text-sm uppercase tracking-widest font-inter">No Matches Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filtered.map((p) => {
              const qty = getQty(p.id);
              return (
                <motion.div
                  key={p.id}
                  className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100/30 flex flex-col items-start gap-4 active:scale-95 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div 
                    className="w-full h-36 bg-[#F8F9FA] rounded-[2rem] flex items-center justify-center text-5xl cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/customer/product/${p.id}`)}
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover p-3" />
                    ) : (
                      <span className="drop-shadow-sm">{p.emoji}</span>
                    )}
                  </div>

                  <div className="w-full px-1 space-y-0.5">
                    <h4 className="font-bold text-[#002D3A] text-[15px] leading-tight font-poppins line-clamp-2">{p.name}</h4>
                    <p className="text-[12px] font-bold text-slate-400 font-inter">{p.unit}</p>
                  </div>

                  <div className="w-full flex items-center justify-between px-1 font-inter">
                    <span className="font-bold text-[#002D3A] text-[18px]">₹{p.price}</span>
                    <button
                      className="bg-[#FED847] text-[#002D3A] px-5 py-2.5 rounded-full text-[13px] font-bold shadow-sm active:scale-90 transition-all"
                      onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}
                    >
                      {qty > 0 ? `${qty}x` : "Add"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Free Delivery Banner - Abstract Truck Icon Matches Screenshot */}
      <motion.div
        className="bg-[#FED847] rounded-[2rem] p-8 py-10 flex items-center justify-between shadow-sm relative overflow-hidden"
        whileHover={{ y: -4 }}
      >
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-[#002D3A] text-[20px] leading-none tracking-tight font-poppins">FREE DELIVERY</h3>
            <p className="text-[13px] font-bold text-[#002D3A]/60 font-inter">On orders over ₹499</p>
          </div>
          <button className="bg-[#002D3A] text-white px-7 py-3 rounded-full text-[12px] font-bold tracking-tight shadow-md active:scale-95 transition-all font-inter">
            CLAIM NOW
          </button>
        </div>

        <div className="relative z-10 h-32 w-32 bg-[#E6C340]/25 rounded-[2.5rem] flex items-center justify-center">
             {/* Abstract Truck Representation from Screenshot */}
             <div className="w-20 h-14 bg-transparent border-[10px] border-[#002D3A]/10 rounded-xl relative group-hover:scale-110 transition-transform">
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#FED847] rounded-full border-[6px] border-[#FED847]" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#FED847] rounded-full border-[6px] border-[#FED847]" />
                <div className="absolute inset-0 border-2 border-[#E6C340]/20 rounded-lg" />
             </div>
        </div>
      </motion.div>
    </div>
  );
}
