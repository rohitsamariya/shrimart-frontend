import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import {
  ShoppingBag,
  Clock,
  MapPin,
  Star,
  Bike,
  Package,
  CheckCircle,
  ArrowRight,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Leaf,
  Shield,
  Truck,
  Zap,
} from "lucide-react";
import riderImage from "@/assets/banner.png";
import { useAuth } from "../context/AuthContext";

const floatingItems = ["🥕", "🍅", "🥦", "🍎", "🥛", "🧅", "🌽", "🍋", "🥬", "🍇"];

const categories = [
  { icon: "🥕", name: "Vegetables", count: "50+ items" },
  { icon: "🍎", name: "Fruits", count: "30+ items" },
  { icon: "🥛", name: "Dairy", count: "20+ items" },
  { icon: "🍟", name: "Snacks", count: "40+ items" },
  { icon: "🧴", name: "Daily Essentials", count: "60+ items" },
];

const steps = [
  { icon: <ShoppingBag size={28} />, title: "Browse & Add", desc: "Choose from fresh groceries across categories" },
  { icon: <MapPin size={28} />, title: "Enter Address", desc: "We deliver anywhere in Shrimadhopur" },
  { icon: <Bike size={28} />, title: "Rider Picks Up", desc: "Our local rider collects your order fresh" },
  { icon: <CheckCircle size={28} />, title: "Delivered!", desc: "Get your order at your doorstep in 30 mins" },
];

const stats = [
  { value: "500+", label: "Happy Customers" },
  { value: "1000+", label: "Orders Delivered" },
  { value: "30 min", label: "Average Delivery" },
  { value: "100%", label: "Fresh Products" },
];

const testimonials = [
  { name: "Ramesh Sharma", text: "Best grocery delivery in Shrimadhopur! Always fresh and on time.", stars: 5 },
  { name: "Priya Gupta", text: "So convenient! I order daily and the riders are always polite.", stars: 5 },
  { name: "Ankit Meena", text: "Great prices and amazing service. Highly recommended!", stars: 5 },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "rider") navigate("/rider");
      else navigate("/customer");
    }
  }, [isLoggedIn, user, navigate]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springX = useSpring(0, { stiffness: 100, damping: 30 });
  const springY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 30;
        const y = (e.clientY - rect.top - rect.height / 2) / 30;
        springX.set(x);
        springY.set(y);
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const goToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-md border-b border-yellow-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#FFD84D] rounded-xl flex items-center justify-center">
            <span className="text-lg">🛒</span>
          </div>
          <span className="font-bold text-[#1F2937] text-[26px] tracking-tight font-poppins">ShriMart</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 font-inter">
          <a href="#how-it-works" className="hover:text-[#1F2937] transition-colors">How it works</a>
          <a href="#categories" className="hover:text-[#1F2937] transition-colors">Categories</a>
          <a href="#testimonials" className="hover:text-[#1F2937] transition-colors">Reviews</a>
        </div>
        <button
          onClick={() => navigate("/login/customer")}
          className="bg-[#FFD84D] text-[#1F2937] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#FFC107] transition-all hover:shadow-glow active:scale-95 font-inter uppercase tracking-tight"
        >
          Customer Login
        </button>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFF6CC 0%, #FFD84D 40%, #FFC107 100%)" }}
      >
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl md:text-4xl select-none pointer-events-none"
            style={{
              left: `${8 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 13) % 80}%`,
              x: springX,
              y: springY,
            }}
            animate={{ y: [0, -18, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          >
            {item}
          </motion.div>
        ))}

        <div className="absolute top-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-yellow-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 pt-24 pb-16">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-[#1F2937] mb-6 shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse" />
              Now delivering in Shrimadhopur, Rajasthan
            </motion.div>

            <h1 className="text-[26px] md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6 font-poppins">
              Fresh Groceries
              <br />
              <span className="text-white drop-shadow-sm">Delivered in</span>
              <br />
              <span className="relative">
                Shrimadhopur
                <motion.div
                  className="absolute -bottom-2 left-0 h-3 bg-white/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </h1>

            <p className="text-[#1F2937]/70 text-lg md:text-xl mb-8 max-w-lg font-inter">
              Fast local grocery delivery by <strong className="font-bold">ShriMart</strong> for Shrimadhopur residents.
              Get fresh vegetables, fruits, dairy & more at your doorstep in 30 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                className="bg-[#1F2937] text-white px-8 py-4 rounded-2xl font-semibold text-base flex items-center gap-2 justify-center hover:bg-black transition-all shadow-xl hover:shadow-2xl group font-inter"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login/customer")}
              >
                <ShoppingBag size={20} />
                Order Groceries
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                className="bg-white text-[#1F2937] px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2 justify-center hover:bg-yellow-50 transition-all shadow-lg group border border-yellow-200 font-inter"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login/rider")}
              >
                <Bike size={20} />
                Become a Delivery Rider
              </motion.button>
            </div>

            <div className="flex gap-6 mt-10 justify-center lg:justify-start font-inter">
              {[["⚡", "30 min", "Delivery"], ["🌿", "100%", "Fresh"], ["⭐", "4.9", "Rating"]].map(([icon, val, lbl]) => (
                <div key={lbl} className="text-center">
                  <div className="text-xl">{icon}</div>
                  <div className="font-bold text-[#1F2937] text-lg">{val}</div>
                  <div className="text-xs text-[#1F2937]/60 font-medium">{lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center items-center relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ x: springX, y: springY }}
          >
            <div className="absolute w-80 h-80 md:w-[420px] md:h-[420px] bg-white/30 rounded-full blur-xl" />
            <motion.img
              src={riderImage}
              alt="ShriMart Delivery Rider"
              className="relative z-10 w-72 md:w-[400px] lg:w-[480px] drop-shadow-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute top-8 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-[#34C759]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1F2937]">Order Delivered!</div>
                <div className="text-xs text-gray-400">Just now · #SRM1024</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-12 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-[#FFC107]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1F2937]">ETA 28 mins</div>
                <div className="text-xs text-gray-400">Rider is nearby</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity }}
        >
          <span className="text-xs font-medium text-[#1F2937]/50">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-[#1F2937]/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              className="w-1.5 h-1.5 bg-[#1F2937]/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-[#1F2937] py-14">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} className="text-center font-inter"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#FFD84D] mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-[#FFF6CC]/40">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="inline-block bg-[#FFD84D]/30 text-[#1F2937] text-sm font-bold px-4 py-1.5 rounded-full mb-4 font-inter">🛍️ Shop by Category</span>
            <h2 className="text-[22px] md:text-4xl font-semibold text-[#1F2937] font-poppins">Everything You Need,</h2>
            <h2 className="text-[22px] md:text-4xl font-semibold text-[#FFC107] font-poppins">All in One Place</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat, i) => (
              <motion.div key={i}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group border border-yellow-100 flex flex-col items-center gap-3 min-w-[130px]"
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.04 }}
                onClick={goToLogin}
              >
                <div className="w-16 h-16 bg-[#FFF6CC] rounded-2xl flex items-center justify-center text-4xl group-hover:bg-[#FFD84D]/30 transition-colors">{cat.icon}</div>
                <div className="font-bold text-[#1F2937] text-sm text-center">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.count}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="inline-block bg-[#FFD84D]/30 text-[#1F2937] text-sm font-bold px-4 py-1.5 rounded-full mb-4 font-inter">⚡ Simple & Fast</span>
            <h2 className="text-[22px] md:text-4xl font-semibold text-[#1F2937] font-poppins">How ShriMart Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#FFD84D] to-[#FFC107] z-0" />
            {steps.map((step, i) => (
              <motion.div key={i} className="relative z-10 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              >
                <div className="w-20 h-20 bg-[#FFD84D] rounded-3xl flex items-center justify-center text-[#1F2937] shadow-lg shadow-yellow-200 mb-5">{step.icon}</div>
                <div className="absolute top-0 right-4 w-6 h-6 bg-[#1F2937] text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                <h3 className="font-semibold text-[#1F2937] mb-2 font-poppins">{step.title}</h3>
                <p className="text-gray-500 text-sm font-inter leading-[1.5]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#1F2937]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h2 className="text-[22px] md:text-4xl font-semibold text-white mb-4 font-poppins">
              Why Choose <span className="text-[#FFD84D]">ShriMart</span>?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap size={24} />, title: "Lightning Fast", desc: "Deliver in under 30 minutes across Shrimadhopur" },
              { icon: <Leaf size={24} />, title: "Farm Fresh", desc: "All products sourced fresh from local markets daily" },
              { icon: <Shield size={24} />, title: "Trusted & Safe", desc: "Verified riders, safe packaging, quality guaranteed" },
              { icon: <Truck size={24} />, title: "Local Delivery", desc: "Serving every corner of Shrimadhopur with care" },
            ].map((feat, i) => (
              <motion.div key={i}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-[#FFD84D]/20 rounded-2xl flex items-center justify-center text-[#FFD84D] mb-4 group-hover:bg-[#FFD84D]/30 transition-colors">{feat.icon}</div>
                <h3 className="font-semibold text-white mb-2 font-poppins">{feat.title}</h3>
                <p className="text-gray-400 text-sm font-inter leading-[1.5]">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-[#FFF6CC]/40">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="inline-block bg-[#FFD84D]/30 text-[#1F2937] text-sm font-bold px-4 py-1.5 rounded-full mb-4 font-inter">⭐ Customer Love</span>
            <h2 className="text-[22px] md:text-4xl font-semibold text-[#1F2937] font-poppins">What People Are Saying</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all border border-yellow-100"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="fill-[#FFD84D] text-[#FFD84D]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFD84D] rounded-full flex items-center justify-center font-black text-[#1F2937]">{t.name[0]}</div>
                  <div>
                    <div className="font-bold text-[#1F2937] text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">Shrimadhopur, Rajasthan</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #FFD84D 0%, #FFC107 100%)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-[22px] md:text-4xl font-semibold text-[#1F2937] mb-3 font-poppins">Ready to Order? 🛒</h2>
              <p className="text-[#1F2937]/70 font-inter">Get your groceries delivered fresh to your door in Shrimadhopur</p>
            </motion.div>
            <motion.div className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <motion.button
                className="bg-[#1F2937] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-black transition-all"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login/customer")}
              >
                <ShoppingBag size={20} /> Order Now
              </motion.button>
              <motion.button
                className="bg-white text-[#1F2937] px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login/rider")}
              >
                <Bike size={20} /> Join as Rider
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-[#FFD84D] rounded-xl flex items-center justify-center"><span className="text-lg">🛒</span></div>
                <span className="font-bold text-[22px] text-white font-poppins">ShriMart</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-inter">Local grocery delivery service bringing freshness to every home in Shrimadhopur, Rajasthan.</p>
              <div className="flex gap-3 mt-5">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD84D] hover:text-[#1F2937] cursor-pointer transition-colors">
                    <Icon size={16} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-poppins uppercase tracking-widest text-xs">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                {["Home", "Browse Groceries", "About Us", "Become a Rider", "Contact"].map((l) => (
                  <a key={l} href="#" className="hover:text-[#FFD84D] transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-poppins uppercase tracking-widest text-xs">Contact Us</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-[#FFD84D]" />Shrimadhopur, Sikar District, Rajasthan</div>
                <div className="flex items-center gap-2"><Phone size={16} className="text-[#FFD84D]" />+91 98765 43210</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
            © 2026 ShriMart. All rights reserved. Made with ❤️ in Rajasthan.
          </div>
        </div>
      </footer>
    </div>
  );
}
