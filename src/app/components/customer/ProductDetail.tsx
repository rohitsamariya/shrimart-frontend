import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { API_BASE } from "../../context/AuthContext";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getQty, cartCount } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState<any[]>([]);


  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setProduct(data.data);
          // Fetch similar products
          fetch(`${API_BASE}/products`)
            .then(res => res.json())
            .then(allData => {
              if (allData.status === "success") {
                const filtered = allData.data.filter((p: any) => p.category === data.data.category && p.id !== data.data.id).slice(0, 4);
                setRelated(filtered);
              }
            });
        }
      })
      .catch(err => console.error("Error fetching product detail:", err))
      .finally(() => setLoading(false));
  }, [id, API_BASE]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-shrimart-yellow animate-spin" />
        <p className="font-bold text-shrimart-black uppercase tracking-widest font-inter">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-8 text-center">
        <motion.span 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="text-8xl"
        >
          😕
        </motion.span>
        <div>
          <h2 className="text-2xl font-bold text-shrimart-black mb-2 font-poppins">Item Not Found</h2>
          <p className="text-gray-500 font-medium font-inter">We couldn't find the product you're looking for.</p>
        </div>
        <button 
          onClick={() => navigate("/customer")} 
          className="w-full max-w-xs bg-shrimart-yellow text-shrimart-black py-4 rounded-2xl font-semibold shadow-glow hover:bg-shrimart-yellow-dark transition-all font-inter"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  const cartQty = getQty(Number(product.id));

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(Number(product.id));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 mix-blend-difference pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all active:scale-90 pointer-events-auto"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <button
          className="relative w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all active:scale-90 pointer-events-auto"
          onClick={() => navigate("/customer/cart")}
        >
          <ShoppingCart size={22} className="text-white" />
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white font-inter"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-[45vh] bg-slate-50 flex items-center justify-center overflow-hidden rounded-b-[4rem]">
        <div className="absolute inset-0 bg-shrimart-yellow/5" />
        <motion.div 
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-shrimart-yellow/20 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        
        <motion.span
          className="text-[12rem] relative z-10 drop-shadow-2xl"
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          {product.emoji}
        </motion.span>

        {/* Floating Badges */}
        <div className="absolute bottom-10 left-8 flex flex-col gap-2 z-20">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-premium font-inter">
            <Star size={14} className="fill-shrimart-yellow text-shrimart-yellow" />
            <span className="font-bold text-shrimart-black text-sm">{product.rating} Rating</span>
          </div>
          <div className="bg-shrimart-black text-shrimart-yellow px-4 py-2 rounded-2xl flex items-center gap-2 shadow-premium font-inter">
            <CheckCircle size={14} />
            <span className="font-bold text-[10px] uppercase tracking-widest">In Stock</span>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="px-6 pt-10 pb-10 space-y-8">
        <div>
        <div>
          <p className="text-shrimart-yellow-dark font-bold text-xs uppercase tracking-[0.2em] mb-2 font-inter">{product.category}</p>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold text-shrimart-black leading-tight font-poppins">{product.name}</h1>
            <div className="flex flex-col items-end font-inter">
              <span className="text-2xl sm:text-3xl font-bold text-shrimart-black">₹{product.price}</span>
              <span className="text-[12px] font-normal text-gray-400 uppercase tracking-widest mt-1">/{product.unit}</span>
            </div>
          </div>
        </div>
        </div>

        <div className="bg-slate-50 border border-gray-100/50 rounded-[2.5rem] p-6 font-inter">
          <h3 className="text-[12px] font-bold text-shrimart-black uppercase tracking-widest mb-3 opacity-40 font-poppins">Overview</h3>
          <p className="text-gray-500 font-normal leading-[1.5] text-sm">{product.desc}</p>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-[2.5rem] p-3 shadow-premium font-inter">
          <div className="flex-1 flex items-center justify-between px-4">
            <button
              className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              <Minus size={20} className="text-shrimart-black" />
            </button>
            <span className="font-bold text-shrimart-black text-2xl w-10 text-center">{qty}</span>
            <button
              className="w-12 h-12 bg-shrimart-yellow rounded-2xl flex items-center justify-center shadow-sm hover:bg-shrimart-yellow-dark transition-all active:scale-90"
              onClick={() => setQty(qty + 1)}
            >
              <Plus size={20} className="text-shrimart-black" />
            </button>
          </div>
          <motion.button
            className={`px-6 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-semibold text-[16px] flex items-center gap-2 sm:gap-3 transition-all min-w-[150px] sm:min-w-[200px] justify-center font-inter ${added ? "bg-[#10B981] text-white shadow-lg" : "bg-shrimart-black text-shrimart-yellow shadow-premium active:scale-95"}`}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            {added ? (
              <><CheckCircle size={20} /> Success</>
            ) : (
              <><Plus size={20} /> Add to Cart</>
            )}
          </motion.button>
        </div>

        {/* Related Section */}
        {related.length > 0 && (
          <div className="pt-4">
            <h3 className="font-semibold text-shrimart-black text-[22px] uppercase mb-5 font-poppins">Similar Picks</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 font-inter">
              {related.map((r) => (
                <motion.div
                  key={r.id}
                  className="flex-shrink-0 bg-slate-50 rounded-[2rem] border border-gray-100/50 p-4 w-36 hover:shadow-md transition-all cursor-pointer group"
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/customer/product/${r.id}`)}
                >
                  <div className="text-5xl text-center mb-4 group-hover:scale-110 transition-transform">{r.emoji}</div>
                  <p className="text-[13px] font-semibold text-shrimart-black text-center truncate mb-1 uppercase tracking-tight font-inter">{r.name}</p>
                  <p className="text-[12px] font-bold text-center text-shrimart-yellow-dark font-inter">₹{r.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
