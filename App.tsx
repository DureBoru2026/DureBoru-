import React, { useState, useEffect, useRef, FormEvent, ChangeEvent, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Leaf, 
  GraduationCap, 
  ShoppingBag, 
  Wallet, 
  Menu, 
  X, 
  Package,
  ChevronLeft,
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  User,
  MessageCircle,
  Send,
  Loader2,
  Bell,
  Home,
  Users2,
  CircleDollarSign,
  Coffee,
  Search,
  Instagram,
  Facebook,
  Linkedin,
  Heart,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Truck,
  Download,
  ExternalLink,
  Video,
  Share2,
  Users,
  Music,
  ThumbsUp,
  Sparkles,
  PlayCircle,
  Play,
  Filter,
  Star,
  FileText,
  Bookmark,
  Image,
  RotateCcw,
  Youtube,
  Megaphone,
  LayoutGrid,
  Code2,
  Sprout,
  MapPin,
  Phone,
  Navigation,
  Info,
  Save,
  DollarSign
} from "lucide-react";
import { translations, Language } from "./translations";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth, db, storage } from "./lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Upload, Edit, Book, BookOpen, Plus, Trash2, Link } from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, where, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";
import { AuthPage } from "./components/AuthPage";
import { AdminPage } from "./components/AdminPage";
import { AboutTimeline } from "./components/AboutTimeline";
import { LazyImage } from "./components/LazyImage";
import { WishlistPage } from "./components/WishlistPage";
import { ProductDetailsModal } from "./components/ProductDetailsModal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Assets
const AGRICULTURE_IMG = "/src/assets/images/ethiopia_modern_agriculture_1783283352129.jpg";
const ACADEMY_IMG = "/src/assets/images/digital_academy_learning_1783283365580.jpg";
const DURE_BORU_LOGO = "/src/assets/images/dure_boru_logo_1783621386199.jpg";

const DEFAULT_BOOKS = [
  {
    id: "def-book-1",
    title: "Qabiyyee Barnoota Qunnamtii fi Teeknoolojii (ICT Guide)",
    author: "Akadaamii Dure Boruu",
    description: "Ibsa guutuu teeknoolojii qunnamtii fi odeeffannoo, bu'uraalee kompiitaraa fi kkf.",
    category: "Technology",
    coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    fileUrl: "https://www.oromiaict.gov.et/",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "def-book-2",
    title: "Modern Agriculture & Smart Farming Tech",
    author: "Dr. Jemal Haji",
    description: "How to apply modern IoT tools, drone monitoring, and scientific soil assessment in Ethiopian agriculture.",
    category: "Agriculture",
    coverUrl: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=600&auto=format&fit=crop&q=80",
    fileUrl: "https://www.fao.org/home/en",
    createdAt: "2026-01-02T00:00:00Z"
  },
  {
    id: "def-book-3",
    title: "Digital Marketing & Brand Building",
    author: "Dure Boru Media",
    description: "Learn how to establish your business on Facebook, TikTok, and Telegram to gain local and international clients.",
    category: "Business",
    coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    fileUrl: "https://www.hubspot.com/",
    createdAt: "2026-01-03T00:00:00Z"
  },
  {
    id: "def-book-4",
    title: "Qajeelfama Hojii Qonna Ammayyaa",
    author: "Ministeera Qonnaa",
    description: "Qajeelfama qonni keenya teeknoolojii hammayyaatiin akka qoratamuu fi bu'aa guddaa fidu gargaaru.",
    category: "Agriculture",
    coverUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80",
    fileUrl: "https://www.moa.gov.et/",
    createdAt: "2026-01-04T00:00:00Z"
  }
];

const OrderStatusTimeline = ({ status, lang }: { status: string, lang: string }) => {
  const stages = lang === "en" ? ['Processing', 'Shipped', 'Delivered'] : ['Hojiirra jira', 'Ergameera', 'Geessifameera'];
  const s = status?.toLowerCase();
  let currentStep = 0;
  if (s === 'shipped') currentStep = 1;
  if (s === 'completed' || s === 'delivered' || s === 'success') currentStep = 2;

  return (
    <div className="w-full pt-6">
      <div className="flex items-center justify-between relative px-4">
        {/* Progress Line Background */}
        <div className="absolute top-[15px] left-8 right-8 h-[2px] bg-slate-100 z-0 overflow-hidden">
          {/* Animated active progress line */}
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (stages.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
        </div>
        
        {stages.map((stage, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div key={stage} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div 
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: i <= currentStep ? "#10b981" : "#ffffff",
                  borderColor: i <= currentStep ? "#ecfdf5" : "#f1f5f9",
                  color: i <= currentStep ? "#ffffff" : "#cbd5e1",
                  boxShadow: isActive ? "0 10px 15px -3px rgba(16, 185, 129, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className={cn(
                  "w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-500"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : isActive ? (
                  <Clock size={16} className="animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </motion.div>
              <motion.span 
                initial={false}
                animate={{
                  color: i <= currentStep ? "#059669" : "#cbd5e1",
                  scale: isActive ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
                className="text-[9px] font-black uppercase tracking-widest text-center"
              >
                {stage}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SpendingTrendsChart = ({ 
  orders, 
  currency, 
  lang, 
  exchangeRate 
}: { 
  orders: any[]; 
  currency: string; 
  lang: string; 
  exchangeRate: number; 
}) => {
  const [useDemoData, setUseDemoData] = useState(false);

  const chartData = React.useMemo(() => {
    if (useDemoData) {
      const baseValues = [14200, 22500, 18900, 31400, 26800, 39500];
      const now = new Date();
      return baseValues.map((val, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        const monthKey = d.toLocaleString(lang === "en" ? "en-US" : "om-ET", { month: "short" });
        const year = d.getFullYear();
        const convertedVal = currency === "ETB" ? val : val / exchangeRate;
        return {
          name: `${monthKey} ${year}`,
          Spending: parseFloat(convertedVal.toFixed(2)),
          Orders: idx + 2
        };
      });
    }

    const months: any[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toLocaleString(lang === "en" ? "en-US" : "om-ET", { month: "short" });
      const year = d.getFullYear();
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        monthName: `${monthKey} ${year}`,
        amount: 0,
        count: 0
      });
    }

    orders.forEach(order => {
      if (order.status?.toLowerCase() === "cancelled") return;
      
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      if (!orderDate || isNaN(orderDate.getTime())) return;
      
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth() + 1;
      const orderMonthKey = `${orderYear}-${String(orderMonth).padStart(2, '0')}`;
      
      const monthObj = months.find(m => m.key === orderMonthKey);
      if (monthObj) {
        const orderAmountETB = order.amount || 0;
        const convertedAmount = currency === "ETB" 
          ? orderAmountETB 
          : orderAmountETB / exchangeRate;
          
        monthObj.amount += convertedAmount;
        monthObj.count += 1;
      }
    });

    return months.map(m => ({
      name: m.monthName,
      Spending: parseFloat(m.amount.toFixed(2)),
      Orders: m.count
    }));
  }, [orders, currency, lang, exchangeRate, useDemoData]);

  const totalSpending = chartData.reduce((acc, curr) => acc + curr.Spending, 0);
  const avgSpending = totalSpending / 6;

  const formattedValue = (val: number) => {
    return `${currency === "ETB" ? "ETB" : "$"} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-800">
            {lang === "en" ? "6-Month Spending Trends" : "Tarsiimoo Kaffaltii Baatii 6"}
          </h3>
          <p className="text-xs text-slate-400 font-medium italic mt-1">
            {lang === "en" ? "Visualizing your financial activity and asset acquisitions" : "Agarsiiftuu qabeenyaafi dhimmoota maallaqaa keessanii"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={useDemoData} 
              onChange={() => setUseDemoData(!useDemoData)}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "en" ? "Demo Data" : "Fakkeenya"}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {lang === "en" ? "Total Spending (6M)" : "Waliigala Baasii (Baatii 6)"}
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block font-mono">
            {formattedValue(totalSpending)}
          </span>
        </div>
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {lang === "en" ? "Monthly Average" : "Giddu-galeessa Baatii"}
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-2 block font-mono">
            {formattedValue(avgSpending)}
          </span>
        </div>
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {lang === "en" ? "Highest Month" : "Baasii Ol'aanaa"}
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block font-mono">
            {formattedValue(Math.max(...chartData.map(c => c.Spending), 0))}
          </span>
        </div>
      </div>

      <div className="w-full h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              className="font-bold uppercase tracking-wider"
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${currency === "ETB" ? "ETB" : "$"}${val >= 1000 ? (val / 1000) + 'k' : val}`}
              dx={-5}
              className="font-mono font-bold"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#0f172a", 
                borderRadius: "16px", 
                border: "none", 
                color: "#fff",
                fontSize: "12px",
                fontFamily: "monospace",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              formatter={(value: any, name: string) => [
                formattedValue(Number(value)),
                lang === "en" ? "Spending" : "Kaffaltii"
              ]}
              labelClassName="font-bold text-slate-400 pb-1"
            />
            <Line 
              type="monotone" 
              dataKey="Spending" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, stroke: "#10b981", fill: "#ffffff" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#047857" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const HomeCarousel = ({ 
  promotions, 
  allMarketProducts, 
  setActivePage, 
  lang, 
  currency, 
  exchangeRate 
}: { 
  promotions: any[]; 
  allMarketProducts: any[]; 
  setActivePage: (page: string) => void; 
  lang: string; 
  currency: string; 
  exchangeRate: number; 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Compile slides
  const slides = React.useMemo(() => {
    const list: any[] = [];

    // 1. Promos from Firestore
    if (promotions && promotions.length > 0) {
      promotions.slice(0, 2).forEach((promo) => {
        list.push({
          id: promo.id,
          type: "PROMOTION",
          label: lang === "en" ? "Featured Offer" : "Beeksiisa Addaa",
          title: promo.title,
          description: promo.description || "",
          imageUrl: promo.imageUrl || "",
          gradient: "from-emerald-500 to-teal-700",
          actionLabel: lang === "en" ? "View Details" : "Bal'ina Ilaali",
          action: () => {
            if (!promo.targetUrl) return;
            if (promo.targetUrl.startsWith("#marketplace-")) {
              const prodId = promo.targetUrl.replace("#marketplace-", "");
              setActivePage("marketplace");
              setTimeout(() => {
                const el = document.getElementById(`product-card-${prodId}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 300);
            } else if (promo.targetUrl.startsWith("#")) {
              const page = promo.targetUrl.replace("#", "");
              setActivePage(page);
            } else {
              window.open(promo.targetUrl, "_blank", "noreferrer");
            }
          }
        });
      });
    } else {
      // Fallback promo
      list.push({
        id: "default-promo",
        type: "PROMOTION",
        label: lang === "en" ? "Special Launch" : "Baniinsa Addaa",
        title: lang === "en" ? "Dure Boru Digital Center" : "Giddu-gala Dure Boru",
        description: lang === "en" ? "Empowering Ethiopian developers & creators" : "Omishaaleefi hojii uumtoota Itoophiyaa jabeessuu",
        imageUrl: "",
        gradient: "from-emerald-600 to-teal-800",
        actionLabel: lang === "en" ? "Explore Marketplace" : "Gabaa Ilaali",
        action: () => setActivePage("marketplace")
      });
    }

    // 2. Academy Course
    list.push({
      id: "academy-course-slide",
      type: "ACADEMY",
      label: lang === "en" ? "Digital Academy" : "Akadaamii Keenya",
      title: lang === "en" ? "Modern Web Development Course" : "Barnoota Misooma Web Ammayyaa",
      description: lang === "en" ? "Enroll in our next cohort to master React, Tailwind, and Firebase." : "Akadaamii keenyaan dandeettii dijitaalaa dabaladhaa.",
      imageUrl: ACADEMY_IMG,
      gradient: "from-blue-600 to-indigo-900",
      actionLabel: lang === "en" ? "Learn More" : "Bal'inaan Baradhu",
      action: () => setActivePage("academy")
    });

    // 3. New Marketplace Arrival
    const arrival = allMarketProducts && allMarketProducts.length > 0 
      ? (allMarketProducts.find(p => p.category === "Modern Agriculture") || allMarketProducts[0])
      : null;
      
    if (arrival) {
      list.push({
        id: `arrival-slide-${arrival.id}`,
        type: "ARRIVAL",
        label: lang === "en" ? "New Arrival" : "Omisha Haaraa",
        title: arrival.name,
        description: arrival.description || arrival.desc || "",
        imageUrl: arrival.imageUrl || AGRICULTURE_IMG,
        gradient: "from-amber-500 to-amber-700",
        actionLabel: lang === "en" ? `Buy for ${currency === "ETB" ? "ETB" : "$"} ${currency === "ETB" ? arrival.price.toLocaleString() : (arrival.price / exchangeRate).toFixed(0)}` : "Ammuma Biti",
        action: () => {
          setActivePage("marketplace");
          setTimeout(() => {
            const el = document.getElementById(`product-card-${arrival.id}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300);
        }
      });
    }

    return list;
  }, [promotions, allMarketProducts, lang, currency, exchangeRate]);

  // Autoplay
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="relative w-full h-[320px] md:h-[400px] rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-900 text-left group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex flex-col justify-end p-8 md:p-12"
        >
          {/* Background image or gradient */}
          {slides[currentIndex]?.imageUrl ? (
            <>
              <img 
                src={slides[currentIndex].imageUrl} 
                alt={slides[currentIndex].title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[4000ms]"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentIndex].type === "ACADEMY" ? "from-[#111] via-[#111]/80" : "from-slate-950 via-slate-950/70"} to-transparent`} />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentIndex]?.gradient || "from-slate-800 to-slate-900"} opacity-90`} />
          )}

          {/* Slide Content */}
          <div className="relative z-10 space-y-3 md:space-y-4 max-w-2xl">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/20",
              slides[currentIndex]?.type === "PROMOTION" ? "bg-emerald-600/50" :
              slides[currentIndex]?.type === "ACADEMY" ? "bg-blue-600/50" : "bg-amber-600/50"
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {slides[currentIndex]?.label}
            </span>

            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight drop-shadow-sm">
              {slides[currentIndex]?.title}
            </h3>

            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed max-w-xl line-clamp-2 drop-shadow-sm">
              {slides[currentIndex]?.description}
            </p>

            <div className="pt-2">
              <button 
                onClick={slides[currentIndex]?.action}
                className="px-6 py-3 rounded-full bg-white text-slate-950 text-xs md:text-sm font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-white transition-all shadow-lg flex items-center gap-2 group-hover:translate-x-1"
              >
                {slides[currentIndex]?.actionLabel}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50 z-20"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50 z-20"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentIndex === idx ? "w-6 bg-[#d4af37]" : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const OrderTrackingMap = ({ orderId, status, lang }: { orderId: string; status: string; lang: string }) => {
  const [courierProgress, setCourierProgress] = useState(0.4); // 0 to 1
  const [isSimulating, setIsSimulating] = useState(false);
  const s = status?.toLowerCase();
  
  // If order is completed or success or delivered, courier is at destination (100%)
  // If processing, courier hasn't left hub (0%)
  // If shipped, courier is in transition (40% to 90%)
  const initialProgress = ["completed", "delivered", "success"].includes(s) 
    ? 1.0 
    : ["processing"].includes(s)
      ? 0.0
      : 0.45;

  useEffect(() => {
    setCourierProgress(initialProgress);
  }, [status]);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setCourierProgress(prev => {
          if (prev >= 1) {
            setIsSimulating(false);
            return 1;
          }
          return Math.min(1, prev + 0.05);
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleSimulate = () => {
    setCourierProgress(0);
    setIsSimulating(true);
  };

  const distanceTotal = 4.8; // km
  const distanceRemaining = Math.max(0, (distanceTotal * (1 - courierProgress))).toFixed(1);
  const etaMinutes = Math.max(0, Math.round(15 * (1 - courierProgress)));

  // SVG coordinates for path
  // Start: (50, 150) - Dure Boru Hub
  // Waypoint 1: (150, 80)
  // Waypoint 2: (250, 180)
  // Destination: (350, 100)
  const getCoordinates = (t: number) => {
    const p0 = { x: 50, y: 150 };
    const p1 = { x: 130, y: 40 };
    const p2 = { x: 240, y: 170 };
    const p3 = { x: 350, y: 100 };

    // Cubic bezier formula:
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
    const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;

    return { x, y };
  };

  const courierPos = getCoordinates(courierProgress);

  return (
    <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-slate-800">
            {lang === "en" ? "Live Courier & Route Tracking" : "Hordoffii Ergaafi Karaa Live"}
          </h4>
          <p className="text-xs text-slate-400 font-medium italic mt-1">
            {lang === "en" ? "Real-time delivery progress from Dure Boru Hub" : "Adeemsa geessituu sa'aatii qabatamaan Giddu-gala Dure Boruu irraa"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              isSimulating 
                ? "bg-slate-100 text-slate-400" 
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            )}
          >
            {isSimulating 
              ? (lang === "en" ? "Tracking..." : "Hordofamaa jira...") 
              : (lang === "en" ? "Simulate Live Route" : "Adeemsa Fakkeessi")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Preview Container */}
        <div className="lg:col-span-2 relative h-56 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800">
          {/* Map grid lines overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          {/* Subtle radar sweep effect if simulating */}
          {isSimulating && (
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent animate-pulse" />
          )}

          {/* Map Watermark & Info */}
          <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5 text-[9px] font-mono text-slate-400">
            {lang === "en" ? "MOCK NAVIGATION ENGINE • GPS SECURE" : "MOCK NAV ENGINE • GPS AMMANSAA"}
          </div>

          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Delivery Route Path Underlay */}
            <path
              d="M 50 150 C 130 40, 240 170, 350 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Animated Active Route Path */}
            <path
              d="M 50 150 C 130 40, 240 170, 350 100"
              fill="none"
              stroke="#059669"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8,6"
            />

            {/* Hub Marker (Starting point) */}
            <g transform="translate(50, 150)">
              <circle r="12" fill="#059669" fillOpacity="0.2" className="animate-ping" />
              <circle r="7" fill="#059669" />
              <circle r="4" fill="#ffffff" />
            </g>
            
            {/* Destination Marker */}
            <g transform="translate(350, 100)">
              <circle r="14" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
              <circle r="8" fill="#ef4444" />
              <circle r="4" fill="#ffffff" />
            </g>

            {/* Courier/Bike Position Marker along the route */}
            <g transform={`translate(${courierPos.x}, ${courierPos.y})`}>
              <circle r="16" fill="#10b981" fillOpacity="0.3" className="animate-pulse" />
              <circle r="10" fill="#10b981" />
              <circle r="9" fill="#047857" />
              <g transform="translate(-5, -5) scale(0.6)" fill="#ffffff">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v11h14c0 .6.4 1 1 1s1-.4 1-1zM5 15V9h6c.3 0 .6.1.8.3L15 13.5v1.5H5z" />
              </g>
            </g>
          </svg>

          {/* Location Labels Overlay */}
          <div className="absolute top-[160px] left-[15px] bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2 py-0.5 rounded text-[9px] font-black uppercase text-slate-300">
            DURE BORU HUB
          </div>
          <div className="absolute top-[60px] right-[10px] bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2 py-0.5 rounded text-[9px] font-black uppercase text-slate-300">
            {lang === "en" ? "DELIVERY POINT" : "IDDOO GEESSITUU"}
          </div>
        </div>

        {/* Courier Info and Live Telemetry Column */}
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-xl font-bold text-slate-600">KT</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="font-black text-sm text-slate-800">Kaleb Tilahun</h5>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  ★ 4.9
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {lang === "en" ? "Eco-Delivery Rider" : "Geessituu Naannoo Eegu"}
              </p>
            </div>
          </div>

          {/* Courier Contact & Vehicle details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                <Phone size={14} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                  {lang === "en" ? "Call Courier" : "Geessituu Bilbili"}
                </p>
                <a href="tel:+251912345678" className="text-[10px] font-black text-slate-800 hover:text-emerald-600">
                  +251 912 345
                </a>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                <Navigation size={14} className="transform rotate-45" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                  {lang === "en" ? "Vehicle ID" : "ID Konkolaataa"}
                </p>
                <p className="text-[10px] font-black text-slate-800">
                  DB-EV-209
                </p>
              </div>
            </div>
          </div>

          {/* Live Telemetry Values */}
          <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100/50 space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-emerald-100/20 pb-2">
              <span className="text-slate-500 font-medium">
                {lang === "en" ? "Distance Remaining" : "Fageenya Hafu"}
              </span>
              <span className="font-black text-emerald-800 font-mono">
                {distanceRemaining} km
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs border-b border-emerald-100/20 pb-2">
              <span className="text-slate-500 font-medium">
                {lang === "en" ? "Estimated Time (ETA)" : "Yeroo tilmaamame"}
              </span>
              <span className="font-black text-emerald-800 font-mono">
                {etaMinutes === 0 ? (lang === "en" ? "Arrived" : "Gaheera") : `${etaMinutes} mins`}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                {lang === "en" ? "Current Location" : "Bakka Ammaa"}
              </span>
              <span className="font-black text-emerald-800 text-right truncate max-w-[120px] text-[10px] uppercase tracking-wider">
                {courierProgress === 0 
                  ? (lang === "en" ? "Dure Boru Hub" : "Giddu-gala Dure Boru") 
                  : courierProgress >= 1 
                    ? (lang === "en" ? "Destination" : "Bakka gahiinsaa") 
                    : (lang === "en" ? "Bole, Road Side" : "Boolee, Daandii")
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating, onRate, disabled }: { rating: number; onRate: (n: number) => void; disabled?: boolean }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          onClick={() => onRate(star)}
          className={cn(
            "transition-all transform",
            disabled ? "cursor-default" : "cursor-pointer hover:scale-125 active:scale-95",
            (hover || rating) >= star ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-slate-200"
          )}
        >
          <Star size={24} />
        </button>
      ))}
    </div>
  );
};

type Page = "home" | "agriculture" | "academy" | "marketplace" | "durePay" | "admin" | "auth" | "orders" | "wishlist" | "profile" | "social" | "about";

interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorId: string;
  content: string;
  createdAt: any;
}


function ResponsiveVideoPlayer({ url }: { url: string }) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!url) return;

    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [url]);

  if (!url) return null;
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  
  if (isYouTube) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1]?.split("?")[0];
    return (
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl bg-black" 
        style={{ paddingTop: '56.25%' }}
      >
        {isInView ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full border-none"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-black text-slate-400">
            <div className="w-14 h-14 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 animate-pulse">
              <Play size={24} className="ml-0.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading masterclass...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-black min-h-[200px] flex items-center justify-center"
    >
      {isInView ? (
        <video controls className="w-full h-auto max-h-[500px]" preload="none">
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
          <div className="w-14 h-14 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 animate-pulse">
            <Video size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading video player...</span>
        </div>
      )}
    </div>
  );
}

function CommentsList({ postId, user, db, t }: { postId: string, user: any, db: any, t: any }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!showComments) return;
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
  }, [postId, showComments]);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    await addDoc(collection(db, "posts", postId, "comments"), {
      postId,
      authorName: user.displayName || "User",
      authorId: user.uid,
      content: newComment,
      createdAt: serverTimestamp(),
    });
    setNewComment("");
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all">
        <MessageCircle size={16} />
        {t.social?.comment} ({comments.length})
      </button>
      {showComments && (
        <>
          {comments.map(comment => (
            <div key={comment.id} className="text-sm">
              <span className="font-black text-slate-900">{comment.authorName}: </span>
              <span className="text-slate-600">{comment.content}</span>
            </div>
          ))}
          {user && (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-sm bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button type="submit" className="p-3 bg-emerald-600 text-white rounded-xl">
                <Send size={16} />
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  likedBy: string[];
  isJemal: boolean;
  createdAt: any;
}

interface UserProfile {
  email: string;
  role: "admin" | "user";
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [activePage, setActivePage] = useState<Page>("home");
  
  // Toast & Browser Notification State
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: "success" | "info" | "warning" }>>([]);

  const addToast = useCallback((title: string, message: string, type: "success" | "info" | "warning" = "info") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);

    // Trigger Browser Notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          const notification = new Notification(title, {
            body: message,
            icon: DURE_BORU_LOGO || "/favicon.ico",
          });
          notification.onclick = () => {
            window.focus();
            setActivePage("orders");
          };
        } catch (e) {
          console.warn("Could not trigger browser Notification:", e);
        }
      }
    }
  }, [setActivePage]);

  // Request Notification permission on first load
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            addToast("Notifications Enabled", "You will now receive real-time updates about your orders!", "success");
          }
        });
      }
    }
  }, [addToast]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // AI Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // QR Code State
  const [showQR, setShowQR] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState({ text: "", type: "" });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setSubscribeMessage({ text: lang === "en" ? "Please enter a valid email address." : "Maaloo teessoo iimeeyilii sirrii galchaa.", type: "error" });
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage({ text: "", type: "" });

    try {
      await addDoc(collection(db, "newsletter"), {
        email: newsletterEmail,
        subscribedAt: serverTimestamp(),
      });
      setSubscribeMessage({ text: lang === "en" ? "Successfully subscribed!" : "Milkiin galmooftaniittu!", type: "success" });
      setNewsletterEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      setSubscribeMessage({ text: lang === "en" ? "An error occurred. Please try again later." : "Rakkoon uumameera. Maaloo irra deebiaa yaalaa.", type: "error" });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Auth State
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Wishlist State with Persistence (Firestore & localStorage fallback)
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("dureboru_wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
      return;
    }
    const q = query(collection(db, "users", user.uid, "wishlist"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.id);
      setWishlist(ids);
      localStorage.setItem("dureboru_wishlist", JSON.stringify(ids));
    }, (err) => {
      console.error("Error loading wishlist from Firestore:", err);
    });
    return () => unsubscribe();
  }, [user]);

  // Marketplace State (Live)
  const [marketProducts, setMarketProducts] = useState<any[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketSort, setMarketSort] = useState<"newest" | "price-low" | "price-high">("newest");
  const [marketCategory, setMarketCategory] = useState<string>("All");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const prevStatuses = useRef<Record<string, string>>({});
  const [currency, setCurrency] = useState<"ETB" | "USD">("ETB");
  const [orderFilter, setOrderFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<any | null>(null);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<any | null>(null);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"telebirr" | "cbe">("telebirr");
  const [selectedOrderForSummary, setSelectedOrderForSummary] = useState<any | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfilePhone, setEditProfilePhone] = useState("");
  const [editProfileBio, setEditProfileBio] = useState("");
  const [editProfilePhoto, setEditProfilePhoto] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  const [editingPrivateNote, setEditingPrivateNote] = useState("");
  const [isSavingPrivateNote, setIsSavingPrivateNote] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostVideoUrl, setNewPostVideoUrl] = useState("");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isUploadingSocial, setIsUploadingSocial] = useState(false);
  const [socialUploadProgress, setSocialUploadProgress] = useState<number | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [activeSocialTab, setActiveSocialTab] = useState<"community" | "jemal">("community");
  const [expandedShippingOrders, setExpandedShippingOrders] = useState<Record<string, boolean>>({});
  const [promotions, setPromotions] = useState<any[]>([]);
  const EXCHANGE_RATE = 120; // 1 USD = 120 ETB (Mock)

  // Web Share Product Action
  const handleShareProduct = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation(); // Prevent opening product details or clicking other card components
    
    // Construct direct URL with product ID query parameter
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${item.id}`;
    const shareTitle = item.name;
    const shareText = item.description || item.desc || `Check out ${item.name} on Dure Boru!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        addToast(
          lang === "en" ? "Shared Successfully" : "Milkiidhaan Ergameera",
          lang === "en" ? "Product link shared with friends!" : "Liinkiin oomishaa hiriyootaaf ergameera!",
          "success"
        );
      } catch (err) {
        console.log("Web Share failed or cancelled:", err);
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        addToast(
          lang === "en" ? "Link Copied" : "Liinkiin Garagalfameera",
          lang === "en" ? "Product link copied to clipboard!" : "Liinkiin oomishaa qabduu garagalchaatti garagalfameera!",
          "success"
        );
      } catch (err) {
        console.error("Failed to copy link:", err);
        addToast(
          lang === "en" ? "Error" : "Dogoggora",
          lang === "en" ? "Could not copy link." : "Liinkii garagalchuun hin danda'amne.",
          "warning"
        );
      }
    }
  };

  // Check URL query parameters for auto-opening product details
  useEffect(() => {
    if (!marketLoading && marketProducts.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("product");
      if (productId) {
        const found = marketProducts.find(p => p.id === productId);
        if (found) {
          setSelectedProductForDetails(found);
          setActivePage("marketplace");
        }
      }
    }
  }, [marketLoading, marketProducts]);

  // Academy Books & Uploads State
  const [academyBooks, setAcademyBooks] = useState<any[]>([]);
  const [isUploadingBook, setIsUploadingBook] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookDesc, setNewBookDesc] = useState("");
  const [newBookCategory, setNewBookCategory] = useState("Technology");
  const [newBookFileUrl, setNewBookFileUrl] = useState("");
  const [newBookCoverUrl, setNewBookCoverUrl] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [bookSelectedCategory, setBookSelectedCategory] = useState("All");

  // Linked Social Media Accounts & Sharing state
  const [socialAccounts, setSocialAccounts] = useState<Record<string, { connected: boolean; username: string }>>({
    facebook: { connected: false, username: "" },
    telegram: { connected: false, username: "" },
    youtube: { connected: false, username: "" },
    tiktok: { connected: false, username: "" },
  });
  const [activeSocialAccountTab, setActiveSocialAccountTab] = useState<"facebook" | "telegram" | "youtube" | "tiktok">("facebook");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<string | null>(null);
  const [socialConnectUsername, setSocialConnectUsername] = useState("");

  // Social sharing assistant
  const [socialSharePostContent, setSocialSharePostContent] = useState("");
  const [socialSharePlatform, setSocialSharePlatform] = useState<"facebook" | "telegram" | "youtube" | "tiktok">("facebook");
  const [isSharingToSocial, setIsSharingToSocial] = useState(false);

  // Academy Enrollment State
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<string | null>(null);
  const [enrollName, setEnrollName] = useState("");
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollPhone, setEnrollPhone] = useState("");
  const [enrollNotes, setEnrollNotes] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleAcademyEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollCourse || !enrollName.trim() || !enrollEmail.trim() || !enrollPhone.trim()) return;

    setIsEnrolling(true);
    try {
      await addDoc(collection(db, "academy_enrollments"), {
        course: selectedEnrollCourse,
        name: enrollName,
        email: enrollEmail,
        phone: enrollPhone,
        notes: enrollNotes,
        userId: user ? user.uid : "guest",
        enrolledAt: serverTimestamp(),
      });
      setEnrollSuccess(true);
      setTimeout(() => {
        setSelectedEnrollCourse(null);
        setEnrollSuccess(false);
        setEnrollName("");
        setEnrollEmail("");
        setEnrollPhone("");
        setEnrollNotes("");
      }, 2500);
    } catch (err) {
      console.error("Error submitting academy application:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUploadBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(lang === "en" ? "Please sign in to upload books!" : "Kitaaba fe'uuf maaloo dura seeni!");
      return;
    }
    if (!newBookTitle.trim() || !newBookAuthor.trim() || !newBookDesc.trim()) {
      alert(lang === "en" ? "Please fill in all required fields!" : "Maaloo dirree barbaachisu hunda guuti!");
      return;
    }
    setIsUploadingBook(true);
    try {
      await addDoc(collection(db, "academy_books"), {
        title: newBookTitle.trim(),
        author: newBookAuthor.trim(),
        description: newBookDesc.trim(),
        category: newBookCategory,
        fileUrl: newBookFileUrl.trim() || "https://dureboru.com",
        coverUrl: newBookCoverUrl.trim() || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
        uploaderId: user.uid,
        uploaderName: profile?.displayName || user.email,
        createdAt: serverTimestamp()
      });
      setIsBookModalOpen(false);
      setNewBookTitle("");
      setNewBookAuthor("");
      setNewBookDesc("");
      setNewBookFileUrl("");
      setNewBookCoverUrl("");
      addToast(
        lang === "en" ? "Book Uploaded" : "Kitaabichi Fe'ameera",
        lang === "en" ? "Your educational resource has been successfully published." : "Kitaabni barnootaa keessan milkaa'inaan maxxanfameera.",
        "success"
      );
    } catch (err) {
      console.error("Error uploading book:", err);
      alert(lang === "en" ? "Failed to upload book." : "Kitaaba fe'uun hin danda'amne.");
    } finally {
      setIsUploadingBook(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm(lang === "en" ? "Are you sure you want to delete this resource?" : "Dhuguma kitaaba kana balleessuu barbaaddu?")) return;
    try {
      await deleteDoc(doc(db, "academy_books", bookId));
      addToast(
        lang === "en" ? "Resource Deleted" : "Qabeenyi Balleeffameera",
        lang === "en" ? "The book has been removed from the academy." : "Kitaabni kun akadaamii keessaa haqameera.",
        "info"
      );
    } catch (err) {
      console.error("Error deleting book:", err);
      alert(lang === "en" ? "Failed to delete resource." : "Kitaaba balleessuun hin danda'amne.");
    }
  };

  const handleConnectSocialAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialConnectUsername.trim() || !isConnectModalOpen) return;
    const platform = isConnectModalOpen;
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: { connected: true, username: socialConnectUsername.trim() }
    }));
    setSocialConnectUsername("");
    setIsConnectModalOpen(null);
    addToast(
      lang === "en" ? "Account Linked" : "Hiriira Maxxansaa",
      lang === "en" ? `Successfully connected your ${platform} account!` : `Akaawuntii ${platform} keessan milkaa'inaan hidhaniittu!`,
      "success"
    );
  };

  const handleDisconnectSocialAccount = (platform: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: { connected: false, username: "" }
    }));
    addToast(
      lang === "en" ? "Account Unlinked" : "Akaawuntiin Haqameera",
      lang === "en" ? `Disconnected your ${platform} account.` : `Akaawuntii ${platform} keessan addaan kuttaniittu.`,
      "info"
    );
  };

  const handleShareToConnectedSocials = async () => {
    if (!socialSharePostContent.trim()) {
      alert(lang === "en" ? "Please write some content to share!" : "Maaloo yaada maxxansuu feetan barreessaa!");
      return;
    }
    const connectedPlatforms = Object.entries(socialAccounts)
      .filter(([_, value]) => (value as any).connected)
      .map(([key]) => key);

    if (connectedPlatforms.length === 0) {
      alert(lang === "en" ? "Please connect at least one social media account first!" : "Maaloo dura yoo xiqqaate akaawuntii miidiyaa hawaasaa tokko hidhaa!");
      return;
    }

    setIsSharingToSocial(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    let shareMessage = encodeURIComponent(socialSharePostContent);
    let targetUrl = "";
    if (socialSharePlatform === "telegram") {
      targetUrl = `https://t.me/share/url?url=${encodeURIComponent("https://dureboru.com")}&text=${shareMessage}`;
    } else if (socialSharePlatform === "facebook") {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://dureboru.com")}&quote=${shareMessage}`;
    } else if (socialSharePlatform === "youtube") {
      targetUrl = `https://youtube.com/`;
    } else if (socialSharePlatform === "tiktok") {
      targetUrl = `https://www.tiktok.com/`;
    }

    setIsSharingToSocial(false);
    setSocialSharePostContent("");

    addToast(
      lang === "en" ? "Cross-Post Successful!" : "Maxxansi Hidhe Milkaa'eera!",
      lang === "en" 
        ? `Successfully published post to: ${connectedPlatforms.join(", ")}!` 
        : `Maxxansi keessan milkaa'inaan gara: ${connectedPlatforms.join(", ")} irratti ergamera!`,
      "success"
    );

    if (targetUrl) {
      window.open(targetUrl, "_blank");
    }
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const isAdminEmail = ["iresojemal44@gmail.com", "jemalfano030@gmail.com"].includes(user.email?.toLowerCase().trim() || "");
        
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          if (isAdminEmail && data.role !== "admin") {
            const updatedProfile = { ...data, role: "admin" as const };
            await setDoc(docRef, updatedProfile);
            setProfile(updatedProfile);
          } else {
            setProfile(data);
          }
        } else {
          // If no profile, create a default one
          const newProfile: UserProfile = {
            email: user.email || "",
            role: isAdminEmail ? "admin" : "user",
            displayName: user.displayName || user.email?.split("@")[0] || "User"
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditProfileName(profile.displayName || "");
      setEditProfilePhone(profile.phoneNumber || "");
      setEditProfileBio(profile.bio || "");
      setEditProfilePhoto(profile.photoURL || "");
    }
  }, [profile]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarketProducts(products);
      setMarketLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "promotions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPromotions(list);
    }, (err) => console.error("Error loading promotions:", err));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "savedPosts"));
    return onSnapshot(q, (snapshot) => {
      setSavedPosts(snapshot.docs.map(doc => doc.id));
    });
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(allPosts);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "academy_books"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAcademyBooks(booksList);
    }, (error) => {
      console.error("Error loading academy books:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      const q = query(
        collection(db, "orders"), 
        where("userId", "==", user.uid), 
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Notification Logic
        newOrders.forEach((order: any) => {
          const oldStatus = prevStatuses.current[order.id];
          const newStatus = order.status?.toLowerCase();
          
          if (oldStatus && oldStatus !== newStatus) {
            let msg = "";
            let title = lang === "en" ? "Order Status Update" : "Oduu Gabaasa Ajajaa";
            if (newStatus === "shipped") {
              msg = t.orders.statusUpdate.shipped.replace("{product}", order.productName);
              addToast(title, msg, "info");
            } else if (newStatus === "delivered" || newStatus === "completed" || newStatus === "success") {
              if (oldStatus !== "delivered" && oldStatus !== "completed" && oldStatus !== "success") {
                msg = t.orders.statusUpdate.delivered.replace("{product}", order.productName);
                addToast(title, msg, "success");
              }
            } else {
              msg = lang === "en" 
                ? `Order for ${order.productName} is now ${newStatus}` 
                : `Ajajni ${order.productName} amma ${newStatus} ta'ee jira`;
              addToast(title, msg, "info");
            }
          }
          prevStatuses.current[order.id] = newStatus;
        });

        setUserOrders(newOrders);
        setOrdersLoading(false);
      }, (err) => {
        console.error("Orders Error:", err);
        setOrdersLoading(false);
      });
      return () => unsubscribe();
    } else {
      setUserOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrderForSummary) {
      setEditingPrivateNote(selectedOrderForSummary.privateNotes || "");
    } else {
      setEditingPrivateNote("");
    }
  }, [selectedOrderForSummary]);

  useEffect(() => {
    if (selectedOrderForSummary) {
      const currentOrder = userOrders.find(o => o.id === selectedOrderForSummary.id);
      if (currentOrder) {
        if (
          currentOrder.privateNotes !== selectedOrderForSummary.privateNotes || 
          currentOrder.status !== selectedOrderForSummary.status || 
          currentOrder.notes !== selectedOrderForSummary.notes
        ) {
          setSelectedOrderForSummary(currentOrder);
        }
      }
    }
  }, [userOrders, selectedOrderForSummary]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setResetSent(false);
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        const res = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const isAdminEmail = ["iresojemal44@gmail.com", "jemalfano030@gmail.com"].includes(authEmail.toLowerCase().trim());
        const newProfile: UserProfile = {
          email: authEmail,
          role: isAdminEmail ? "admin" : "user",
          displayName: authName || authEmail.split("@")[0]
        };
        await setDoc(doc(db, "users", res.user.uid), newProfile);
      }
      setActivePage("home");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setAuthError(lang === "en" ? "Incorrect email or password. Please try again." : "Iimayilii yookaan ibsa-darbaa dogoggoraa. Maaloo lammata yaalaa.");
      } else if (err.code === "auth/email-already-in-use") {
        setAuthError(lang === "en" ? "This email is already in use. Try signing in." : "Iimayiliin kun kanaan dura itti fayyadamameera. Galuuf yaalaa.");
      } else {
        setAuthError(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setActivePage("home");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!authEmail) {
      setAuthError(lang === "en" ? "Please enter your email first." : "Maaloo dura iimayilii keessan galchaa.");
      return;
    }
    setAuthError("");
    try {
      await sendPasswordResetEmail(auth, authEmail);
      setResetSent(true);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setActivePage("home");
  };

  const AVATAR_OPTIONS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bastian",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Nala",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar",
  ];

  const handleUpdateAvatar = async (url: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: url
      });
      setProfile(prev => prev ? { ...prev, photoURL: url } : null);
      setEditProfilePhoto(url);
      alert(t.orders?.profile?.success);
    } catch (err) {
      console.error(err);
      alert(t.orders?.profile?.error);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingProfilePic(true);
    try {
      let downloadUrl = "";
      try {
        const fileRef = ref(storage, `profiles/${user.uid}_${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (storageError) {
        console.warn("Firebase Storage failed, falling back to local base64:", storageError);
        downloadUrl = await convertToBase64(file);
      }

      if (downloadUrl) {
        setEditProfilePhoto(downloadUrl);
      }
    } catch (err) {
      console.error("Profile pic upload failed:", err);
      alert(lang === "en" ? "Failed to upload image." : "Suura olfeessuu hin dandeenye.");
    } finally {
      setIsUploadingProfilePic(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedFields = {
        displayName: editProfileName,
        phoneNumber: editProfilePhone,
        bio: editProfileBio,
        photoURL: editProfilePhoto,
      };
      await updateDoc(userRef, updatedFields);
      setProfile(prev => prev ? { ...prev, ...updatedFields } : null);
      setIsEditingProfile(false);
      alert(t.orders?.profile?.success || "Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert(t.orders?.profile?.error || "Error updating profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleExportCSV = () => {
    const filtered = userOrders.filter(order => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      
      let matchesStatus = true;
      if (orderFilter !== "All") {
        if (orderFilter === "Completed") matchesStatus = ["completed", "success", "delivered"].includes(order.status?.toLowerCase());
        else matchesStatus = order.status?.toLowerCase() === orderFilter.toLowerCase();
      }

      let matchesDate = true;
      if (startDate) {
        const start = new Date(startDate);
        matchesDate = matchesDate && orderDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && orderDate <= end;
      }

      return matchesStatus && matchesDate;
    });

    if (filtered.length === 0) {
      alert(lang === "en" ? "No transactions found to download." : "Gurgurtaawwan buufamu danda'an hin argamne.");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Product Name",
      "Amount (ETB)",
      "Amount (USD)",
      "Status",
      "Secure Transaction ID",
      "Payment Method",
      "Payer Account",
      "Recipient Account",
      "Notes",
      "Private Notes"
    ];

    const rows = filtered.map(order => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      const dateStr = orderDate instanceof Date && !isNaN(orderDate.getTime()) ? orderDate.toLocaleDateString() : "Pending";
      const amountETB = order.amount || 0;
      const amountUSD = (amountETB / EXCHANGE_RATE).toFixed(2);
      
      return [
        order.id || "",
        dateStr,
        order.productName || "",
        amountETB,
        amountUSD,
        order.status || "",
        order.secureTxId || "",
        order.paymentMethod || "",
        order.payerAccount || "",
        order.recipientAccount || "",
        (order.notes || "").replace(/"/g, '""'),
        (order.privateNotes || "").replace(/"/g, '""')
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Dure_Boru_Transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBuyProduct = (product: any) => {
    if (!user) {
      setActivePage("auth");
      return;
    }
    setSelectedProductForPurchase(product);
    setPurchaseNote("");
    setPayerPhone("");
    setSelectedPaymentMethod("telebirr");
  };

  const finalizePurchase = async () => {
    if (!selectedProductForPurchase || !user) return;
    if (!payerPhone.trim()) {
      alert(lang === "en" ? "Please provide your payment account number/phone or name for secure verification." : "Maaloo odeeffannoo kaffaltii keessanii (lakkoofsa bilbilaa ykn maqaa) mirkaneessaaf galchaa.");
      return;
    }
    
    try {
      const generatedTxId = "SEC-TX-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        productId: selectedProductForPurchase.id,
        productName: selectedProductForPurchase.name,
        amount: selectedProductForPurchase.price,
        status: "completed",
        notes: purchaseNote || "",
        downloadUrl: selectedProductForPurchase.type === "digital" ? (selectedProductForPurchase.fileUrl || "#") : null,
        payerAccount: payerPhone,
        paymentMethod: selectedPaymentMethod,
        secureTxId: generatedTxId,
        recipientAccount: selectedPaymentMethod === "telebirr" ? "+251995852194" : "CBE Birr - Jemal Fano Haji",
        createdAt: serverTimestamp()
      });
      
      const successMsg = lang === "en" 
        ? `Secure Purchase Successful!\nTransaction ID: ${generatedTxId}\n\nYour purchase is registered securely. Check 'My Orders' in your profile to access your download.`
        : `Bittaa Mirkaneessi Milkaa'eera!\nKoodii Kaffaltii: ${generatedTxId}\n\nOdeeffannoon keessan amansiisaafi iccitii qabuun galmeeffameera. Download gochuuf 'Ajajawwan Koo' profile keessan jala seenaa.`;
      
      alert(successMsg);
      setSelectedProductForPurchase(null);
      setPurchaseNote("");
      setPayerPhone("");
    } catch (err) {
      console.error("Buy Error:", err);
      alert("Error processing purchase.");
    }
  };

  const handleRateOrder = async (orderId: string, rating: number) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        rating: rating,
        ratedAt: serverTimestamp()
      });
      alert(t.orders.rating.success);
    } catch (err) {
      console.error("Rating Error:", err);
      alert("Error submitting rating.");
    }
  };

  const handleReorder = (order: any) => {
    const productToReorder = {
      id: order.productId || "reorder",
      name: order.productName,
      price: order.amount,
      type: order.downloadUrl ? "digital" : "physical",
      fileUrl: order.downloadUrl
    };
    setSelectedProductForPurchase(productToReorder);
    setSelectedOrderForSummary(null);
  };

  const handleShareOrder = async (order: any) => {
    const shareData = {
      title: `Order Summary: ${order.productName}`,
      text: `I just ordered ${order.productName} from Dure Boru! Order ID: #${order.id.toUpperCase()}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert(lang === "en" ? "Order details copied to clipboard!" : "Bal'inni ajajaa gara clipboard-itti garagalfameera!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share error:", err);
      }
    }
  };

  const handleSavePrivateNotes = async (orderId: string, notesText: string) => {
    setIsSavingPrivateNote(true);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        privateNotes: notesText
      });
      addToast(
        lang === "en" ? "Notes Saved" : "Yaadni Olkaa'ameera",
        lang === "en" ? "Your private notes have been successfully saved to Firestore." : "Yaadni dhuunfaa keessan milkiidhaan Firestore irratti olkaa'ameera.",
        "success"
      );
    } catch (err) {
      console.error("Error saving private notes:", err);
      addToast(
        lang === "en" ? "Save Failed" : "Olkaayinsi Hin Milkoofne",
        lang === "en" ? "Failed to save private notes. Please try again." : "Yaada dhuunfaa olkaayuun hin danda'amne. Maaloo irra deebi'ii yaali.",
        "warning"
      );
    } finally {
      setIsSavingPrivateNote(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!newPostContent.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newPostContent }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSocialFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSocial(true);
    setSocialUploadProgress(0);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    try {
      let downloadUrl = "";
      try {
        const fileRef = ref(storage, `social_posts/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setSocialUploadProgress(progress);
            },
            (error) => {
              reject(error);
            },
            async () => {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (storageError) {
        console.warn("Firebase Storage failed, falling back to local/base64 upload:", storageError);
        if (isImage) {
          downloadUrl = await convertToBase64(file);
        } else {
          downloadUrl = URL.createObjectURL(file);
        }
      }

      if (downloadUrl) {
        if (isImage) {
          setGeneratedImageUrl(downloadUrl);
        } else {
          setNewPostVideoUrl(downloadUrl);
        }
      }
    } catch (err) {
      console.error("Upload process failed:", err);
      alert(lang === "en" ? "Failed to upload file. Please try again." : "Narra dhufe: feeyilaa olfeessuu hin dandeenye. Maaloo deebisaatii yaalaa.");
    } finally {
      setIsUploadingSocial(false);
      setSocialUploadProgress(null);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!user || !comment.trim()) return;
    await addDoc(collection(db, "posts", postId, "comments"), {
      postId,
      authorName: profile?.displayName || "User",
      authorId: user.uid,
      content: comment,
      createdAt: serverTimestamp(),
    });
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSharePost = async (postId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("post", postId);
    try {
      await navigator.clipboard.writeText(url.toString());
      alert(t.social?.shareSuccess || "Post link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleToggleBookmark = async (post: Post) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "savedPosts", post.id);
    if (savedPosts.includes(post.id)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        postId: post.id,
        savedAt: serverTimestamp()
      });
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim()) return;
    setIsPosting(true);
    try {
      const postData = {
        userId: user.uid,
        authorName: profile?.displayName || "User",
        authorPhoto: profile?.photoURL || "",
        content: newPostContent,
        imageUrl: generatedImageUrl,
        videoUrl: newPostVideoUrl,
        likes: 0,
        likedBy: [],
        isJemal: user.email === "jemalfano030@gmail.com",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "posts"), postData);
      setNewPostContent("");
      setGeneratedImageUrl("");
      setNewPostVideoUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (post: Post) => {
    if (!user) {
      setActivePage("auth");
      return;
    }
    const isLiked = post.likedBy.includes(user.uid);
    const newLikedBy = isLiked 
      ? post.likedBy.filter(id => id !== user.uid)
      : [...post.likedBy, user.uid];
    
    try {
      await updateDoc(doc(db, "posts", post.id), {
        likedBy: newLikedBy,
        likes: newLikedBy.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(t.orders.cancelConfirm)) return;
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "cancelled" });
      alert(t.orders.cancelSuccess);
    } catch (err: any) {
      console.error("Cancel Order Error:", err);
      alert("Error cancelling order: " + err.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    if (postId) {
      setActivePage("social");
      setTimeout(() => {
        const el = document.getElementById(`post-${postId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Optional highlight effect
          el.classList.add("ring-4", "ring-emerald-500", "ring-opacity-50", "transition-all", "duration-1000");
          setTimeout(() => el.classList.remove("ring-4", "ring-emerald-500", "ring-opacity-50"), 2000);
        }
      }, 1000);
    }
  }, []);

  const toggleLang = () => setLang(prev => prev === "en" ? "om" : "en");

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setChatMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, lang }),
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: "ai", text: data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { role: "ai", text: "Sorry, I am having trouble connecting. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: { type: string, name: string, desc: string, page: Page }[] = [];

    // Search Agriculture
    t.agriculture.items.forEach(item => {
      if (item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)) {
        results.push({ ...item, type: "Agriculture", page: "agriculture" });
      }
    });

    // Search Academy
    t.academy.courses.forEach(course => {
      if (course.name.toLowerCase().includes(query) || course.desc.toLowerCase().includes(query)) {
        results.push({ ...course, type: "Academy", page: "academy" });
      }
    });

    // Search Marketplace (Dynamic)
    marketProducts.forEach(item => {
      if (item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)) {
        results.push({ ...item, type: "Marketplace", page: "marketplace", desc: item.description || "" });
      }
    });

    // Search Marketplace (Static Fallback)
    t.marketplace.items.forEach(item => {
      if (item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)) {
        // Prevent duplicates from static translations if we have dynamic ones
        if (!results.some(r => r.name === item.name)) {
          results.push({ ...item, type: "Marketplace", page: "marketplace" });
        }
      }
    });

    return results;
  };

  const searchResults = getSearchResults();

  const allMarketProducts = [
    ...marketProducts.map(p => ({ ...p, inStock: p.inStock !== false })),
    ...t.marketplace.items
      .filter(staticItem => !marketProducts.some(p => p.name === staticItem.name))
      .map((item, idx) => {
        const isOut = item.name === "Agri-Drone Pro";
        return { ...item, id: `static-${idx}`, imageUrl: "", inStock: !isOut };
      })
  ];

  const sortedMarketplace = [...allMarketProducts].sort((a, b) => {
    if (marketSort === "price-low") return a.price - b.price;
    if (marketSort === "price-high") return b.price - a.price;
    return 0;
  });

  const filteredMarketplace = sortedMarketplace.filter(p => {
    if (showWishlistOnly && !wishlist.includes(p.id)) return false;
    const matchCategory = marketCategory === "All" || p.category === marketCategory;
    if (!matchCategory) return false;
    if (p.price > maxPriceFilter) return false;
    if (inStockOnly && !p.inStock) return false;
    return true;
  });

  const toggleWishlist = async (itemId: string) => {
    const exists = wishlist.includes(itemId);
    
    if (user) {
      try {
        const wishRef = doc(db, "users", user.uid, "wishlist", itemId);
        if (exists) {
          await deleteDoc(wishRef);
        } else {
          await setDoc(wishRef, {
            productId: itemId,
            addedAt: new Date().toISOString(),
          });
        }
        addToast(
          lang === "en" ? "Wishlist Updated" : "Kufaama Haaromfame",
          exists ? t.orders.wishlist.removed : t.orders.wishlist.added,
          "success"
        );
      } catch (err) {
        console.error("Error toggling wishlist in Firestore:", err);
        // Fallback local if Firestore write fails
        setWishlist(prev => 
          exists 
            ? prev.filter(id => id !== itemId) 
            : [...prev, itemId]
        );
      }
    } else {
      // Guest local storage fallback
      setWishlist(prev => {
        const updated = exists 
          ? prev.filter(id => id !== itemId) 
          : [...prev, itemId];
        localStorage.setItem("dureboru_wishlist", JSON.stringify(updated));
        return updated;
      });
      addToast(
        lang === "en" ? "Wishlist Updated" : "Kufaama Haaromfame",
        exists ? t.orders.wishlist.removed : t.orders.wishlist.added,
        "success"
      );
    }
  };

  const getWishlistItems = () => {
    const allItems = [
      ...marketProducts.map(item => ({ ...item, type: "Marketplace" })),
      ...t.academy.courses.map(item => ({ ...item, id: item.name, name: item.name, type: "Academy", price: 0 })),
      ...t.agriculture.items.map(item => ({ ...item, id: item.name, name: item.name, type: "Agriculture", price: 0 }))
    ];
    return allItems.filter(item => wishlist.includes(item.id));
  };

  const wishlistItems = getWishlistItems();

  const exportToCSV = () => {
    const transactions = [
      { name: "Digital Academy Course", date: "Jul 05, 2026", status: "success", amount: "-1,200" },
      { name: "Marketplace Sale", date: "Jul 04, 2026", status: "success", amount: "+2,450" },
      { name: "Subscription Renewal", date: "Jul 03, 2026", status: "failed", amount: "-500" },
      { name: "P2P Transfer", date: "Jul 02, 2026", status: "success", amount: "+1,000" },
    ];
    
    const headers = ["Merchant", "Date", "Status", "Amount"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => `${t.name},${t.date},${t.status},${t.amount}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `durepay_transactions_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const NavItem = ({ page, icon: Icon, label }: { page: Page, icon: any, label: string }) => (
    <button
      onClick={() => { setActivePage(page); setIsMenuOpen(false); }}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300",
        activePage === page 
          ? "bg-emerald-100 text-emerald-900" 
          : "text-slate-400 hover:text-slate-600"
      )}
    >
      <Icon size={24} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans text-slate-900 overflow-x-hidden pb-32">
      {/* Navigation Header */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 border-b border-slate-100",
        scrolled ? "bg-white/90 backdrop-blur-md" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActivePage("home")}>
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-[#d4af37] flex items-center justify-center bg-amber-50">
              <img
                src={DURE_BORU_LOGO}
                alt="Dure Boru Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 bg-clip-text text-transparent flex items-center gap-1">
              DURE BORU <span className="text-sm">🥇</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-slate-50 p-1.5 rounded-full border border-slate-100">
            {[
              { id: "home", label: t.nav.home, icon: Home },
              { id: "agriculture", label: t.nav.agriculture, icon: Leaf },
              { id: "academy", label: t.nav.academy, icon: GraduationCap },
              { id: "marketplace", label: t.nav.marketplace, icon: ShoppingBag },
              { id: "wishlist", label: lang === "en" ? "Wishlist" : "Kufaama", icon: Heart },
              { id: "social", label: "Social", icon: MessageCircle },
              { id: "durePay", label: t.nav.durePay, icon: Wallet },
              { id: "about", label: t.nav.about, icon: Info },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.05]",
                  activePage === item.id 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-black" 
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 font-bold"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            {profile?.role === "admin" && (
              <button
                onClick={() => setActivePage("admin")}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.05]",
                  activePage === "admin" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-black" 
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 font-bold"
                )}
              >
                <ShieldCheck size={16} />
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder={lang === "en" ? "Search..." : "Barbaadi..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-colors w-48 focus:w-64"
              />
              <AnimatePresence>
                {isSearchFocused && searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100]"
                  >
                    {searchResults.slice(0, 6).map((result, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setActivePage(result.page as Page);
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-sm text-slate-900 line-clamp-1">{result.name}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{result.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{result.desc}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={toggleLang}
              className="hidden sm:block px-4 py-2 rounded-full border border-slate-200 hover:bg-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              {lang === "en" ? "Afan Oromo" : "English"}
            </button>
            
            {loading ? (
              <Loader2 className="animate-spin text-slate-400" size={20} />
            ) : user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActivePage("wishlist")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all relative",
                    activePage === "wishlist" ? "bg-rose-100 text-rose-900" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  )}
                >
                  <div className="relative">
                    <Heart size={14} className={wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""} />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                  </div>
                  <span>{lang === "en" ? "Wishlist" : "Kufaama"}</span>
                  {wishlist.length > 0 && (
                    <span className="ml-1 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActivePage("orders")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                    activePage === "orders" ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  )}
                >
                  <Clock size={14} />
                  {lang === "en" ? "Orders" : "Ajaja"}
                </button>
                <button 
                  onClick={() => setActivePage("profile")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                    activePage === "profile" ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  )}
                >
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <User size={12} />
                    </div>
                  )}
                  <span className="hidden sm:inline">{profile?.displayName || "Profile"}</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all bg-rose-50 text-rose-600 hover:bg-rose-100"
                  title="Logout"
                >
                  <XCircle size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setActivePage("auth"); setAuthMode("login"); }}
                  className="hidden sm:block px-6 py-2 rounded-full bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setActivePage("auth"); setAuthMode("signup"); }}
                  className="px-6 py-2 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                >
                  Create Account
                </button>
              </div>
            )}
            
            <button className="p-2 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={32} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Sidebar/Drawer) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-[160] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-black tracking-tighter text-xl">MENU</span>
                <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
              </div>
              
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder={lang === "en" ? "Search..." : "Barbaadi..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
                />
                <AnimatePresence>
                  {searchQuery && searchResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[200]"
                    >
                      {searchResults.slice(0, 5).map((result, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setActivePage(result.page as Page);
                            setSearchQuery("");
                            setIsMenuOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-slate-900 line-clamp-1">{result.name}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{result.type}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{result.desc}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-6 overflow-y-auto max-h-[80vh] pb-8">
                {[
                  { id: "home", label: t.nav.home, icon: Home },
                  { id: "agriculture", label: t.nav.agriculture, icon: Leaf },
                  { id: "academy", label: t.nav.academy, icon: GraduationCap },
                  { id: "marketplace", label: t.nav.marketplace, icon: ShoppingBag },
                  { id: "wishlist", label: lang === "en" ? "Wishlist" : "Kufaama", icon: Heart },
                  { id: "social", label: t.social?.title, icon: Users2 },
                  { id: "durePay", label: t.nav.durePay, icon: Wallet },
                  { id: "about", label: t.nav.about, icon: Info },
                  ...(profile?.role === "admin" ? [{ id: "admin", label: "Admin", icon: ShieldCheck }] : []),
                  ...(user ? [
                    { id: "orders", label: lang === "en" ? "Orders" : "Ajaja", icon: Clock },
                    { id: "profile", label: t.orders.profile.title, icon: User }
                  ] : []),
                ].map((item) => {
                  const isWishlist = item.id === "wishlist";
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActivePage(item.id as Page); setIsMenuOpen(false); }}
                      className={cn(
                        "flex items-center gap-4 text-2xl font-black transition-colors text-left relative",
                        activePage === item.id ? "text-blue-600" : "text-slate-400 hover:text-blue-600"
                      )}
                    >
                      <div className="relative">
                        <item.icon size={28} />
                        {isWishlist && wishlist.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                          </span>
                        )}
                      </div>
                      <span>{item.label}</span>
                      {isWishlist && wishlist.length > 0 && (
                        <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full min-w-[22px] text-center">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  );
                })}

                <hr className="border-slate-100" />
                
                <button 
                  onClick={() => { toggleLang(); setIsMenuOpen(false); }}
                  className="flex items-center gap-4 text-2xl font-black transition-colors text-left text-slate-400 hover:text-blue-600"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-900 border border-slate-200">
                    {lang === "en" ? "EN" : "OM"}
                  </div>
                  {lang === "en" ? "Afan Oromo" : "English"}
                </button>

                {user ? (
                  <button 
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 text-2xl font-black transition-colors text-left text-rose-500 hover:text-rose-600"
                  >
                    <XCircle size={28} />
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 mt-2">
                    <button 
                      onClick={() => { setActivePage("auth"); setAuthMode("login"); setIsMenuOpen(false); }}
                      className="px-6 py-4 rounded-xl bg-slate-100 text-slate-900 text-base font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-center"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { setActivePage("auth"); setAuthMode("signup"); setIsMenuOpen(false); }}
                      className="px-6 py-4 rounded-xl bg-blue-600 text-white text-base font-black uppercase tracking-widest hover:bg-blue-700 transition-all text-center shadow-lg shadow-blue-900/10"
                    >
                      Create Account
                    </button>
                  </div>
                )}
                
                <div className="mt-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Connect with us</p>
                  <div className="flex items-center gap-4">
                    <a href="https://facebook.com/dureboru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all" aria-label="Facebook">
                      <Facebook size={24} />
                    </a>
                    <a href="https://t.me/dureboru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#0088cc] hover:bg-[#0088cc]/10 transition-all" aria-label="Telegram">
                      <Send size={24} />
                    </a>
                    <a href="https://youtube.com/@dureboru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#FF0000] hover:bg-[#FF0000]/10 transition-all" aria-label="YouTube">
                      <Youtube size={24} />
                    </a>
                    <a href="https://tiktok.com/@dureboru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#000000] hover:bg-[#000000]/10 transition-all" aria-label="TikTok">
                      <Music size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="pt-24">
        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowQR(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl relative overflow-hidden text-center space-y-8"
              >
                <button 
                  onClick={() => setShowQR(false)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900">{t.durePay.qrTitle}</h3>
                  <p className="text-slate-500 text-sm font-medium">{t.durePay.qrDesc}</p>
                </div>

                <div className="aspect-square bg-slate-50 rounded-[2rem] border-4 border-slate-100 flex items-center justify-center p-8 relative group">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.8rem]" />
                  <div className="grid grid-cols-4 gap-2 opacity-20">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={cn("w-full aspect-square rounded-sm bg-slate-900", i % 3 === 0 ? "opacity-100" : "opacity-40")} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode size={120} className="text-slate-900" />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Ready for Scan
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activePage === "auth" && (
            <AuthPage 
              mode={authMode} 
              setMode={setAuthMode}
              email={authEmail}
              setEmail={setAuthEmail}
              password={authPassword}
              setPassword={setAuthPassword}
              name={authName}
              setName={setAuthName}
              error={authError}
              handleAuth={handleAuth}
              handleGoogleSignIn={handleGoogleSignIn}
              handleForgotPassword={handleForgotPassword}
              resetSent={resetSent}
              lang={lang}
            />
          )}

          {activePage === "admin" && profile?.role === "admin" && (
            <AdminPage products={marketProducts} lang={lang} addToast={addToast} />
          )}

          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-6 text-center space-y-12 py-12"
            >
              <div className="space-y-8 pt-12">
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl text-blue-600 max-w-2xl mx-auto leading-relaxed font-extrabold">
                    {t.hero.bio}
                  </p>
                </div>
              </div>

              {/* Automatic Image Carousel Component */}
              <HomeCarousel 
                promotions={promotions}
                allMarketProducts={allMarketProducts}
                setActivePage={setActivePage}
                lang={lang}
                currency={currency}
                exchangeRate={EXCHANGE_RATE}
              />

              {/* Promotions / Beeksiisa Section */}
              {promotions.length > 0 && (
                <div className="w-full text-left space-y-6 py-6 border-y border-slate-100">
                  <div className="flex items-center gap-2">
                    <Megaphone className="text-emerald-600 animate-bounce" size={20} />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {lang === "en" ? "Featured Promotions & Offers" : "Beeksiisa & Oomishaalee Filataman"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {promotions.slice(0, 4).map((promo) => {
                      let cardBg = "bg-emerald-600 text-white";
                      let titleColor = "text-white";
                      let descColor = "text-emerald-100";
                      let icon = <Globe size={18} />;
                      
                      if (promo.platform === "youtube") {
                        cardBg = "bg-[#FF0000] text-white";
                        descColor = "text-red-100";
                        icon = <Youtube size={18} />;
                      } else if (promo.platform === "tiktok") {
                        cardBg = "bg-black text-white border border-cyan-500/30";
                        titleColor = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500";
                        descColor = "text-slate-300";
                        icon = <Music size={18} className="text-cyan-400" />;
                      } else if (promo.platform === "facebook") {
                        cardBg = "bg-[#1877F2] text-white";
                        descColor = "text-blue-50";
                        icon = <Facebook size={18} />;
                      }

                      const handlePromoClick = () => {
                        if (!promo.targetUrl) return;
                        if (promo.targetUrl.startsWith("#marketplace-")) {
                          const prodId = promo.targetUrl.replace("#marketplace-", "");
                          setActivePage("marketplace");
                          setTimeout(() => {
                            const el = document.getElementById(`product-card-${prodId}`);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                          }, 300);
                        } else if (promo.targetUrl.startsWith("#")) {
                          const page = promo.targetUrl.replace("#", "") as Page;
                          setActivePage(page);
                        } else {
                          window.open(promo.targetUrl, "_blank", "noreferrer");
                        }
                      };

                      return (
                        <motion.div
                          key={promo.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          onClick={handlePromoClick}
                          className={`p-6 rounded-[2.5rem] shadow-md ${cardBg} cursor-pointer flex flex-col justify-between min-h-[160px] group transition-all relative overflow-hidden`}
                        >
                          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-all duration-700" />
                          
                          <div className="space-y-4 relative z-10 w-full">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-white/10">
                                {icon} {promo.platform === "standard" ? "Dure Boru" : promo.platform}
                              </div>
                              <div className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white">
                                <ExternalLink size={12} />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className={`text-lg font-black leading-snug tracking-tight ${titleColor}`}>
                                {promo.title}
                              </h4>
                              {promo.description && (
                                <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${descColor}`}>
                                  {promo.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {promo.imageUrl && (
                            <div className="mt-4 rounded-2xl overflow-hidden h-28 relative z-10 border border-white/10">
                              <img src={promo.imageUrl} alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button 
                  onClick={() => setActivePage("academy")}
                  className="w-full py-6 bg-[#111] text-white rounded-full font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t.hero.cta} <ArrowRight size={24} />
                </button>
                <button 
                  onClick={() => setActivePage("marketplace")}
                  className="w-full py-6 bg-white border-2 border-slate-200 text-slate-900 rounded-full font-black text-xl hover:bg-slate-50 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t.hero.browse}
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 pt-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-[#fdfcf8] bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm uppercase tracking-widest">
                  <span>Free to start</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span>No monthly fees</span>
                </div>
              </div>

              {/* Success Stories Section */}
              <div className="pt-32 pb-20">
                <div className="text-center space-y-4 mb-20">
                  <h2 className="text-5xl font-black tracking-tighter text-slate-900">{t.testimonials.title}</h2>
                  <p className="text-xl text-slate-500 font-medium italic">{t.testimonials.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.testimonials.items.map((testimonial, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group text-left relative overflow-hidden">
                      <div className="mb-8 relative">
                        <div className="w-12 h-1 bg-emerald-500 rounded-full mb-6" />
                        <p className="text-xl font-medium text-slate-700 leading-relaxed italic">{testimonial.text}</p>
                      </div>
                      <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{testimonial.name}</p>
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Marquee Bar */}
              <div className="border-y border-slate-100 py-6 overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="flex justify-center gap-8 md:gap-16 whitespace-nowrap px-4">
                  <span className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    {t.features.all}
                  </span>
                </div>
              </div>

              {/* "Just Arrived" Section (YE-BUNA Style) */}
              <div className="text-left py-16 space-y-8 max-w-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
                    <div className="w-8 h-[2px] bg-indigo-600" />
                    NEW ARRIVALS
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter flex items-center gap-3 text-slate-900 leading-tight">
                    <span role="img" aria-label="fire">🔥</span> Just Arrived!
                  </h2>
                  <p className="text-slate-500 text-xl font-medium leading-relaxed">
                    Discover our latest physical product releases from top Ethiopian creators.
                  </p>
                </div>
                <button 
                  onClick={() => setActivePage("marketplace")}
                  className="px-10 py-5 bg-white border-2 border-slate-200 rounded-full font-black text-xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
                >
                  View all <ArrowRight size={24} />
                </button>
              </div>

              {/* Testimonials Section */}
              <div className="py-20 space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                    {t.testimonials.title}
                  </h2>
                  <p className="text-slate-500 text-lg font-medium">
                    {t.testimonials.subtitle}
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {t.testimonials.items.map((item, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative">
                      <div className="absolute top-8 right-8 text-slate-100 group-hover:text-emerald-50 transition-colors">
                        <MessageCircle size={60} />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <p className="text-slate-600 font-medium italic leading-relaxed">
                          "{item.text}"
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt={item.name} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{item.name}</p>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{item.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription Section */}
              <div className="py-20 px-12 bg-white rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-slate-50 group-hover:text-emerald-50 transition-colors -rotate-12">
                  <Send size={150} />
                </div>
                <div className="relative z-10 space-y-8 max-w-xl text-left">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                      {t.newsletter.title}
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      {t.newsletter.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      placeholder={t.newsletter.placeholder}
                      className="flex-1 px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-full font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 whitespace-nowrap">
                      {t.newsletter.button}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "agriculture" && (
            <motion.div
              key="agriculture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-12 space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-slate-900">{t.agriculture.title}</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">{t.agriculture.description}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {t.agriculture.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-slate-100 group-hover:text-emerald-100 transition-colors">
                      <Leaf size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                        <Leaf size={32} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">{item.name}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      <button 
                        onClick={() => alert(`${item.name} details coming soon!`)}
                        className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-sm hover:gap-4 transition-all"
                      >
                        Explore Project <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activePage === "academy" && (
            <motion.div
              key="academy"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <div className="bg-[#111] rounded-[4rem] overflow-hidden grid lg:grid-cols-2 shadow-2xl">
                <div className="p-12 md:p-20 space-y-10 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest">
                    <Zap size={14} /> New Semester Open
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{t.academy.title}</h2>
                  <p className="text-xl text-slate-400 leading-relaxed font-medium">{t.academy.description}</p>
                  <div className="space-y-4">
                    {t.academy.courses.map((course, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setSelectedEnrollCourse(course.name);
                          if (profile) {
                            setEnrollName(profile.name || "");
                            setEnrollEmail(user?.email || "");
                            setEnrollPhone(profile.phone || "");
                          }
                        }}
                        className="flex items-center gap-5 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 cursor-pointer transition-all group"
                      >
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                          <GraduationCap size={24} />
                        </div>
                        <div>
                          <p className="font-black text-white text-lg flex items-center gap-2">
                            {course.name}
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              {lang === "en" ? "Apply" : "Ilaali"}
                            </span>
                          </p>
                          <p className="text-sm text-slate-500 font-medium">{course.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedEnrollCourse(t.academy.courses[0]?.name || "Web Development");
                      if (profile) {
                        setEnrollName(profile.name || "");
                        setEnrollEmail(user?.email || "");
                        setEnrollPhone(profile.phone || "");
                      }
                    }}
                    className="w-full py-6 bg-emerald-600 text-white rounded-full font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20"
                  >
                    {t.academy.apply}
                  </button>
                </div>
                <div className="relative h-full min-h-[500px]">
                  <img 
                    src={ACADEMY_IMG} 
                    alt="Digital Academy" 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                </div>
              </div>

              {/* Enrollment Modal */}
              <AnimatePresence>
                {selectedEnrollCourse && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md"
                    onClick={() => setSelectedEnrollCourse(null)}
                  >
                    <motion.div 
                      initial={{ scale: 0.95, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 30 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-[3.5rem] p-10 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden space-y-6 text-left"
                    >
                      <button 
                        onClick={() => setSelectedEnrollCourse(null)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full"
                      >
                        <X size={20} />
                      </button>

                      {enrollSuccess ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                        >
                          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-500 animate-bounce">
                            <CheckCircle2 size={48} />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                              {lang === "en" ? "Application Received!" : "Galmeen Keessan Ergameera!"}
                            </h3>
                            <p className="text-slate-500 font-medium max-w-sm">
                              {lang === "en" ? `You have applied for ${selectedEnrollCourse}. We will contact you via phone or email soon.` : `Barnoota ${selectedEnrollCourse}f galmooftaniittu. Dhiyeenyatti bilbilaan ykn iimeeyiliin isin qunnamna.`}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleAcademyEnroll} className="space-y-6">
                          <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                              <GraduationCap size={14} /> {lang === "en" ? "Academy Enrollment" : "Galmee Akadaamii"}
                            </span>
                            <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                              {lang === "en" ? "Join the Cohort" : "Koorasitti Dabalami"}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium">
                              {lang === "en" ? "Fill out the application below to secure your spot." : "Ilaalcha keessan dabalanii odeeffannoo armaan gadii guutaa."}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Selected Course" : "Koorsii Filatame"}</label>
                              <select 
                                value={selectedEnrollCourse}
                                onChange={(e) => setSelectedEnrollCourse(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                              >
                                {t.academy.courses.map((c, i) => (
                                  <option key={i} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Full Name" : "Maqaa Guutuu"}</label>
                              <input 
                                type="text" 
                                required
                                value={enrollName}
                                onChange={(e) => setEnrollName(e.target.value)}
                                placeholder={lang === "en" ? "e.g. Abebe Kebede" : "fkn. Tarreeffama Maqaa"}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Email Address" : "Iimeeyilii"}</label>
                                <input 
                                  type="email" 
                                  required
                                  value={enrollEmail}
                                  onChange={(e) => setEnrollEmail(e.target.value)}
                                  placeholder="abebe@example.com"
                                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Phone Number" : "Lakk. Bilbilaa"}</label>
                                <input 
                                  type="tel" 
                                  required
                                  value={enrollPhone}
                                  onChange={(e) => setEnrollPhone(e.target.value)}
                                  placeholder="+251 900 000000"
                                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Message or Background (Optional)" : "Ergaa ykn Muuxannoo (Filannoo)"}</label>
                              <textarea 
                                value={enrollNotes}
                                onChange={(e) => setEnrollNotes(e.target.value)}
                                placeholder={lang === "en" ? "Tell us why you want to take this course..." : "Maaliif koorsii kana fudhachuu akka feetan nuu ibsaa..."}
                                rows={3}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500 resize-none animate-none"
                              />
                            </div>
                          </div>

                          <button 
                            type="submit"
                            disabled={isEnrolling}
                            className="w-full py-5 bg-emerald-600 text-white rounded-full font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                          >
                            {isEnrolling ? <Loader2 className="animate-spin" size={20} /> : (lang === "en" ? "Submit Application" : "Galmeessi Ergi")}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {allMarketProducts.filter(p => p.category === "Digital Academy" && p.videoUrl).length > 0 && (
                <div className="mt-16 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Video size={24} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">Video Masterclasses</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allMarketProducts
                      .filter(p => p.category === "Digital Academy" && p.videoUrl)
                      .map((course, idx) => (
                      <motion.div 
                        key={course.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm p-4 space-y-4"
                      >
                        <ResponsiveVideoPlayer url={course.videoUrl} />
                        <div className="px-4 pb-4">
                          <h4 className="font-black text-lg text-slate-900">{course.name}</h4>
                          <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-2">{course.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Books & Materials Library */}
              <div className="mt-20 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight text-slate-900">
                        {lang === "en" ? "Academy Library & Resources" : "Mana Kitaaba fi Qabeenya Akadaamii"}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">
                        {lang === "en" ? "Explore hand-picked books, tutorials, and PDF resources" : "Kitaabilee, qajeelfamoota fi barruulee PDF filataman dubbisaa"}
                      </p>
                    </div>
                  </div>

                  {/* Upload Trigger Button */}
                  {user && (
                    <button
                      onClick={() => setIsBookModalOpen(true)}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 self-start md:self-auto"
                    >
                      <Plus size={14} />
                      {lang === "en" ? "Upload Resource" : "Qabeenya Fe'i"}
                    </button>
                  )}
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-3xl">
                  {/* Search input */}
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder={lang === "en" ? "Search books or authors..." : "Kitaabilee ykn barreessitoota barbaadi..."}
                      value={bookSearchQuery}
                      onChange={(e) => setBookSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* Category filters */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                    {["All", "Technology", "Agriculture", "Business", "Health", "Others"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBookSelectedCategory(cat)}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                          bookSelectedCategory === cat
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15"
                            : "bg-white text-slate-500 hover:text-slate-800 border border-slate-100"
                        )}
                      >
                        {cat === "All" ? (lang === "en" ? "All Categories" : "Hunda") : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Books Grid */}
                {(() => {
                  const mergedBooks = [...DEFAULT_BOOKS, ...academyBooks];
                  const filteredBooks = mergedBooks.filter((book) => {
                    const matchesSearch = 
                      book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
                      book.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
                      book.description?.toLowerCase().includes(bookSearchQuery.toLowerCase());
                    const matchesCategory = bookSelectedCategory === "All" || book.category === bookSelectedCategory;
                    return matchesSearch && matchesCategory;
                  });

                  if (filteredBooks.length === 0) {
                    return (
                      <div className="text-center py-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 space-y-4">
                        <Book size={48} className="mx-auto text-slate-300" />
                        <p className="text-slate-500 font-bold">
                          {lang === "en" ? "No books found matching criteria." : "Kitaabni barbaaddan hin argamne."}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredBooks.map((book) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -6, scale: 1.01 }}
                          className="bg-white rounded-[2.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative"
                        >
                          {/* Delete option for book owner */}
                          {user && book.uploaderId === user.uid && (
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="absolute top-4 right-4 z-10 p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                              title={lang === "en" ? "Delete Resource" : "Balleessi"}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}

                          <div className="space-y-4">
                            {/* Cover image */}
                            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 relative shadow-inner">
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                                {book.category}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-1.5 px-1">
                              <h4 className="font-black text-slate-900 leading-snug line-clamp-2 text-base group-hover:text-emerald-600 transition-colors">
                                {book.title}
                              </h4>
                              <p className="text-xs font-bold text-slate-400">
                                {lang === "en" ? "By" : "Kan"} {book.author}
                              </p>
                              <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                                {book.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 px-1">
                            {/* Download or View button */}
                            <a
                              href={book.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                              <Download size={12} />
                              {lang === "en" ? "Download" : "Buufadhu"}
                            </a>
                            <a
                              href={book.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-colors"
                              title={lang === "en" ? "Open Link" : "Bani"}
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Upload Book Modal */}
              <AnimatePresence>
                {isBookModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md"
                    onClick={() => setIsBookModalOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 30 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-[3rem] p-8 md:p-10 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[90vh] space-y-6"
                    >
                      <button
                        onClick={() => setIsBookModalOpen(false)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full"
                      >
                        <X size={20} />
                      </button>

                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                          <BookOpen size={14} /> {lang === "en" ? "Academy Library" : "Mana Kitaaba Akadaamii"}
                        </span>
                        <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                          {lang === "en" ? "Upload Educational Resource" : "Kitaaba Barnootaa Maxxansi"}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium">
                          {lang === "en" ? "Share books, PDFs, or guides with the community." : "Kitaabilee, barruulee ykn qajeelfamoota hawaasaaf qoodaa."}
                        </p>
                      </div>

                      <form onSubmit={handleUploadBook} className="space-y-4 text-left">
                        <div className="space-y-1">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Book Title" : "Mata Duree Kitaabaa"} *</label>
                          <input
                            type="text"
                            required
                            placeholder={lang === "en" ? "e.g. Modern Web Development Guide" : "fkn. Qajeelfama Qonna Ammayyaa"}
                            value={newBookTitle}
                            onChange={(e) => setNewBookTitle(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Author Name" : "Barreessaa / Maqaa Keessan"} *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Abebe"
                              value={newBookAuthor}
                              onChange={(e) => setNewBookAuthor(e.target.value)}
                              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Category" : "Ramaddii"}</label>
                            <select
                              value={newBookCategory}
                              onChange={(e) => setNewBookCategory(e.target.value)}
                              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                            >
                              <option value="Technology">Technology</option>
                              <option value="Agriculture">Agriculture</option>
                              <option value="Business">Business</option>
                              <option value="Health">Health</option>
                              <option value="Others">Others</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Description" : "Ibsa Gabaabaa"} *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder={lang === "en" ? "Write a short summary..." : "Kitaaba kana irratti ibsa gabaabaa barreessi..."}
                            value={newBookDesc}
                            onChange={(e) => setNewBookDesc(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "PDF or File Download Link" : "Liinkii Kitaabni Jiru (Google Drive, Dropbox, kkf)"}</label>
                          <input
                            type="url"
                            placeholder="https://example.com/book.pdf"
                            value={newBookFileUrl}
                            onChange={(e) => setNewBookFileUrl(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Cover Image Link (URL)" : "Fakkii Kitaabichaa (Cover Image Link)"}</label>
                          <input
                            type="url"
                            placeholder="https://example.com/cover.jpg"
                            value={newBookCoverUrl}
                            onChange={(e) => setNewBookCoverUrl(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUploadingBook}
                          className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg"
                        >
                          {isUploadingBook ? <Loader2 className="animate-spin" size={20} /> : (lang === "en" ? "Publish Book" : "Maxxansi")}
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activePage === "marketplace" && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-12 space-y-12"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter text-slate-900">{t.marketplace.title}</h2>
                  <p className="text-xl text-slate-500 font-medium italic">{t.marketplace.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="relative group min-w-[150px] flex-1 sm:flex-none">
                    <select 
                      value={marketCategory}
                      onChange={(e) => setMarketCategory(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-100 pl-6 pr-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <option value="All">{t.marketplace.categories.all}</option>
                      <option value="Modern Agriculture">{t.marketplace.categories.agriculture}</option>
                      <option value="Digital Academy">{t.marketplace.categories.academy}</option>
                      <option value="Software">{t.marketplace.categories.software}</option>
                      <option value="General">{t.marketplace.categories.general}</option>
                      <option value="Video">{t.marketplace.categories.video}</option>
                      <option value="Image">{t.marketplace.categories.image}</option>
                      <option value="Templates">{t.marketplace.categories.templates}</option>
                      <option value="Documents">{t.marketplace.categories.documents}</option>
                      <option value="Education">{t.marketplace.categories.education}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  <div className="relative group min-w-[150px] flex-1 sm:flex-none">
                    <select 
                      value={marketSort}
                      onChange={(e) => setMarketSort(e.target.value as any)}
                      className="w-full appearance-none bg-slate-50 border border-slate-100 pl-6 pr-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <option value="newest">{t.marketplace.newest}</option>
                      <option value="price-low">{t.marketplace.priceLow}</option>
                      <option value="price-high">{t.marketplace.priceHigh}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl">
                    <button 
                      onClick={() => setShowWishlistOnly(false)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        !showWishlistOnly ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {lang === "en" ? "Market" : "Gabaa"}
                    </button>
                    <button 
                      onClick={() => setShowWishlistOnly(true)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative",
                        showWishlistOnly ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-rose-500"
                      )}
                    >
                      <Heart size={10} fill={showWishlistOnly ? "currentColor" : "none"} />
                      {lang === "en" ? "Wishlist" : "Kadhannaa"}
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl">
                    <button 
                      onClick={() => setCurrency("ETB")}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        currency === "ETB" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      ETB
                    </button>
                    <button 
                      onClick={() => setCurrency("USD")}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        currency === "USD" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      USD
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Range and In-Stock Filters Panel */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Price Range Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <DollarSign size={14} className="text-emerald-600" />
                      {lang === "en" ? "Max Price Limit" : "Daangaa Gatii Olaanaa"}
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                      {currency === "ETB" ? "ETB" : "$"} {
                        currency === "ETB"
                          ? maxPriceFilter.toLocaleString()
                          : (maxPriceFilter / EXCHANGE_RATE).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                      }
                    </span>
                  </div>
                  <div className="relative flex items-center pt-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={maxPriceFilter}
                      onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{currency === "ETB" ? "0 ETB" : "$0"}</span>
                    <span>{currency === "ETB" ? "100,000 ETB" : "$833"}</span>
                  </div>
                </div>

                {/* Availability and Reset */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-6 md:pt-0 border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {lang === "en" ? "In-Stock Only" : "Kanneen Harka Irra Jiran Qofa"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none border border-slate-200",
                        inStockOnly ? "bg-emerald-600 border-emerald-600" : "bg-slate-100"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-300 shadow-md",
                          inStockOnly ? "translate-x-6" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {(maxPriceFilter !== 100000 || inStockOnly) && (
                    <button
                      type="button"
                      onClick={() => {
                        setMaxPriceFilter(100000);
                        setInStockOnly(false);
                      }}
                      className="px-5 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-slate-900/10"
                    >
                      {lang === "en" ? "Reset Filters" : "Calaltuu Haqi"}
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Category Filter Strip with Icons */}
              <div className="w-full bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {lang === "en" ? "Filter by Core Category" : "Akka dhimmaatti calali"}
                  </span>
                  <div className="text-xs font-medium text-slate-500">
                    {lang === "en" ? "Selected Category" : "Gosa Filatame"}: <span className="font-bold text-slate-800">{marketCategory === "All" ? (lang === "en" ? "All Products" : "Hunda") : marketCategory}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      value: "All",
                      label: t.marketplace.categories.all,
                      icon: LayoutGrid,
                      desc: lang === "en" ? "Browse entire marketplace catalog" : "Kuusaalee gabaa hunda ilaali",
                      count: allMarketProducts.length
                    },
                    {
                      value: "Modern Agriculture",
                      label: t.marketplace.categories.agriculture,
                      icon: Sprout,
                      desc: lang === "en" ? "Smart farming tools & agricultural assets" : "Meeshaalee qonna ammayyaafi dhimmoota qonnaa",
                      count: allMarketProducts.filter(p => p.category === "Modern Agriculture").length
                    },
                    {
                      value: "Digital Academy",
                      label: t.marketplace.categories.academy,
                      icon: GraduationCap,
                      desc: lang === "en" ? "Educational courses, masterclasses & guides" : "Koorsiiwwan, dandeettiiwwan fi qajeelfamoota",
                      count: allMarketProducts.filter(p => p.category === "Digital Academy" || p.category === "Education").length
                    },
                    {
                      value: "Software",
                      label: t.marketplace.categories.software,
                      icon: Code2,
                      desc: lang === "en" ? "Software tools, apps & digital templates" : "Meeshaalee saaftuwerii, apilikeeshinii fi pirogiraamota",
                      count: allMarketProducts.filter(p => p.category === "Software").length
                    }
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isActive = marketCategory === cat.value;
                    
                    return (
                      <motion.button
                        key={cat.value}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setMarketCategory(cat.value);
                          setShowWishlistOnly(false);
                        }}
                        className={cn(
                          "flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group shadow-sm",
                          isActive 
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10" 
                            : "bg-white border-slate-200/60 text-slate-800 hover:border-slate-300 hover:shadow"
                        )}
                      >
                        {isActive && (
                          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                        )}
                        
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
                            isActive 
                              ? "bg-white/10 text-white" 
                              : "bg-slate-50 text-slate-600 group-hover:bg-slate-100"
                          )}>
                            <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                          </div>
                          
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider",
                            isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-slate-100 text-slate-500"
                          )}>
                            {cat.count}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm tracking-tight mb-1">
                          {cat.label}
                        </h4>
                        
                        <p className={cn(
                          "text-[11px] leading-tight line-clamp-2",
                          isActive ? "text-slate-300" : "text-slate-400 group-hover:text-slate-500"
                        )}>
                          {cat.desc}
                        </p>

                        <div className={cn(
                          "absolute bottom-0 left-0 right-0 h-[3px] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                          isActive ? "bg-emerald-500" : "bg-slate-300"
                        )} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {marketLoading ? (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center gap-6">
                    <Loader2 className="animate-spin text-emerald-600" size={48} />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Loading Marketplace...</p>
                  </div>
                ) : filteredMarketplace.length === 0 ? (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                      {showWishlistOnly ? <Heart size={48} /> : <ShoppingBag size={48} />}
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                      {showWishlistOnly 
                        ? (lang === "en" ? "Your wishlist is empty." : "Kadhannaan kee duwwaadha.")
                        : (lang === "en" ? "No products found matching filters." : "Oomishni calalame hin argamne.")}
                    </p>
                    {showWishlistOnly ? (
                      <button 
                        onClick={() => setShowWishlistOnly(false)}
                        className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:underline"
                      >
                        {lang === "en" ? "Explore Marketplace" : "Gabaa Daawwadhu"}
                      </button>
                    ) : (
                      (maxPriceFilter !== 100000 || inStockOnly) ? (
                        <button 
                          onClick={() => {
                            setMaxPriceFilter(100000);
                            setInStockOnly(false);
                          }}
                          className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:underline"
                        >
                          {lang === "en" ? "Reset filters" : "Calaltuu Haqi"}
                        </button>
                      ) : (
                        profile?.role === "admin" && (
                          <button 
                            onClick={() => setActivePage("admin")}
                            className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:underline"
                          >
                            Add your first product
                          </button>
                        )
                      )
                    )}
                  </div>
                ) : (
                  filteredMarketplace.map((item, i) => (
                    <motion.div 
                      key={item.id} 
                      id={`product-card-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -12, scale: 1.025 }}
                      className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-emerald-300 transition-all duration-500 group shadow-sm hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.2)] relative"
                    >
                      <button 
                        onClick={(e) => handleShareProduct(e, item)}
                        className="absolute top-6 right-20 z-20 w-12 h-12 rounded-2xl bg-white text-slate-400 hover:text-emerald-600 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                        title={lang === "en" ? "Share Product" : "Oomisha Qoodi"}
                      >
                        <Share2 size={20} />
                      </button>
                      <button 
                        onClick={() => toggleWishlist(item.id)}
                        className={cn(
                          "absolute top-6 right-6 z-20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                          wishlist.includes(item.id) 
                            ? "bg-rose-500 text-white" 
                            : "bg-white text-slate-300 hover:text-rose-500"
                        )}
                      >
                        <Heart size={24} fill={wishlist.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                      <div className="aspect-[4/5] bg-[#f8f9fa] relative overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setSelectedProductForDetails(item)}>
                        {item.imageUrl ? (
                          <LazyImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                        ) : (
                          <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-slate-200 group-hover:text-emerald-500 transition-all group-hover:rotate-12">
                            <ShoppingBag size={48} />
                          </div>
                        )}
                      </div>
                      <div className="p-8 space-y-6">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-black text-xl text-slate-900 leading-tight cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => setSelectedProductForDetails(item)}>{item.name}</h4>
                            {item.inStock ? (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider border border-emerald-100 flex-shrink-0">
                                {lang === "en" ? "In Stock" : "Jira"}
                              </span>
                            ) : (
                              <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider border border-rose-100 flex-shrink-0">
                                {lang === "en" ? "Out Of Stock" : "Dhumeera"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest line-clamp-1">{item.category}</p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductForDetails(item);
                              }}
                              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                              <Star size={10} className="text-amber-400 fill-amber-400" />
                              <span>{lang === "en" ? "Reviews" : "Madaallii"}</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-2xl font-black tracking-tighter">
                            {currency === "ETB" ? "ETB" : "$"} { 
                              currency === "ETB" 
                                ? item.price.toLocaleString() 
                                : (item.price / EXCHANGE_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                            }
                          </span>
                          <button 
                            disabled={!item.inStock}
                            onClick={() => handleBuyProduct(item)}
                            className={cn(
                              "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg",
                              item.inStock 
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/10" 
                                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                            )}
                          >
                            {item.inStock ? (
                              <>
                                <ArrowRight size={14} />
                                {lang === "en" ? "Buy Now" : "Amma Bitadhu"}
                              </>
                            ) : (
                              lang === "en" ? "Sold Out" : "Dhumeera"
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Adventure & Tools Section */}
              <div className="mt-24 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
                      <Sparkles size={14} />
                      Featured Resources
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                      {t.marketplace.adventure.title}
                    </h2>
                    <p className="text-slate-500 font-medium italic">
                      {t.marketplace.adventure.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Tool 1: Gemini AI */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Gemini AI</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      Leverage Google's most capable AI model for your business and creative projects.
                    </p>
                    <div className="flex items-center gap-4">
                      <a 
                        href="https://gemini.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                      >
                        Try Gemini <ExternalLink size={12} />
                      </a>
                      <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Tool 2: Video Tutorials */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                      <Video size={32} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Video Library</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      Exclusive video tutorials on agriculture, tech, and digital marketing in Amharic & Oromo.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
                        Watch Now <PlayCircle size={12} />
                      </button>
                      <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                        <ThumbsUp size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Tool 3: Invite Friends */}
                  <div className="bg-emerald-600 p-8 rounded-[3rem] shadow-lg shadow-emerald-900/20 text-white group flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                        <Users size={32} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight mb-2">{t.marketplace.adventure.invite}</h3>
                      <p className="text-emerald-50/70 text-sm leading-relaxed mb-6">
                        Invite your friends to the Dure Boru digital platform and earn exclusive rewards.
                      </p>
                    </div>
                    <button className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                      Send Invitation <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">
                    {t.orders.title}
                  </h1>
                  <p className="text-slate-500 font-medium italic">
                    {lang === "en" ? "Your past transactions and digital downloads." : "Seenaa kaffaltii fi buufata keessan."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-slate-900 focus:ring-0 cursor-pointer pr-8"
                    >
                      <option value="All">{t.orders.filterAll}</option>
                      <option value="Processing">{t.orders.filterProcessing}</option>
                      <option value="Shipped">{t.orders.filterShipped}</option>
                      <option value="Completed">{t.orders.filterDelivered}</option>
                      <option value="Cancelled">{t.orders.filterCancelled}</option>
                    </select>
                  </div>

                  <div className="h-8 w-px bg-slate-100 hidden md:block" />

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1">
                      <Calendar size={14} />
                      Date Range
                    </span>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-2 py-1">
                      <span className="text-[10px] font-bold text-slate-400 px-2">Start Date</span>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent border-none px-2 py-1 text-xs font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-0 transition-colors"
                      />
                      <span className="text-slate-300 px-2">→</span>
                      <span className="text-[10px] font-bold text-slate-400 px-2">End Date</span>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent border-none px-2 py-1 text-xs font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                    {(startDate || endDate) && (
                      <button 
                        onClick={() => { setStartDate(""); setEndDate(""); }}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Clear Date Filter"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>

                  <div className="h-8 w-px bg-slate-100 hidden lg:block" />

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const now = new Date();
                        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        setStartDate(startOfMonth.toISOString().split("T")[0]);
                        setEndDate(now.toISOString().split("T")[0]);
                      }}
                      className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-transparent hover:border-emerald-100"
                    >
                      {t.orders.summary.thisMonth}
                    </button>
                    <button 
                      onClick={() => {
                        const now = new Date();
                        const startOf3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                        setStartDate(startOf3Months.toISOString().split("T")[0]);
                        setEndDate(now.toISOString().split("T")[0]);
                      }}
                      className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-transparent hover:border-emerald-100"
                    >
                      {t.orders.summary.last3Months}
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                      title={lang === "en" ? "Download CSV" : "CSV Buufadhu"}
                    >
                      <Download size={12} />
                      {lang === "en" ? "CSV" : "CSV"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Spending Trends Chart Visualization */}
              <div className="mb-12">
                <SpendingTrendsChart 
                  orders={userOrders} 
                  currency={currency} 
                  lang={lang} 
                  exchangeRate={EXCHANGE_RATE} 
                />
              </div>

              {ordersLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-emerald-600" size={48} />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Fetching your orders...</p>
                </div>
              ) : userOrders.filter(order => {
                const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
                
                // Status Filter
                let matchesStatus = true;
                if (orderFilter !== "All") {
                  if (orderFilter === "Completed") matchesStatus = ["completed", "success", "delivered"].includes(order.status?.toLowerCase());
                  else matchesStatus = order.status?.toLowerCase() === orderFilter.toLowerCase();
                }

                // Date Filter
                let matchesDate = true;
                if (startDate) {
                  const start = new Date(startDate);
                  matchesDate = matchesDate && orderDate >= start;
                }
                if (endDate) {
                  const end = new Date(endDate);
                  end.setHours(23, 59, 59, 999);
                  matchesDate = matchesDate && orderDate <= end;
                }

                return matchesStatus && matchesDate;
              }).length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-6 shadow-sm">
                   <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                      <ShoppingBag size={48} />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                      {orderFilter === "All" 
                        ? (lang === "en" ? "You haven't made any purchases yet." : "Hanga ammaatti waan bitattan hin qabdan.")
                        : (lang === "en" ? `No orders with status "${orderFilter}" found.` : `Ajajni haala "${orderFilter}" qabu hin argamne.`)}
                    </p>
                    <button 
                      onClick={() => {
                        if (orderFilter !== "All") setOrderFilter("All");
                        else setActivePage("marketplace");
                      }}
                      className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                    >
                      {orderFilter === "All" ? t.hero.browse : t.orders.filterAll}
                    </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {userOrders
                    .filter(order => {
                      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
                      
                      let matchesStatus = true;
                      if (orderFilter !== "All") {
                        if (orderFilter === "Completed") matchesStatus = ["completed", "success", "delivered"].includes(order.status?.toLowerCase());
                        else matchesStatus = order.status?.toLowerCase() === orderFilter.toLowerCase();
                      }

                      let matchesDate = true;
                      if (startDate) {
                        const start = new Date(startDate);
                        matchesDate = matchesDate && orderDate >= start;
                      }
                      if (endDate) {
                        const end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        matchesDate = matchesDate && orderDate <= end;
                      }

                      return matchesStatus && matchesDate;
                    })
                    .map((order) => (
                    <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setSelectedOrderForSummary(order)}>
                          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                            <Package size={40} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">{order.productName}</h3>
                              <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100">
                                <ExternalLink size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
                              <span>{order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : "Pending"}</span>
                              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                              <span className="text-emerald-600 font-black">
                                {currency === "ETB" ? "ETB" : "$"} {
                                  currency === "ETB" 
                                    ? order.amount.toLocaleString() 
                                    : (order.amount / EXCHANGE_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 italic text-slate-500 text-sm">
                            <span className="font-black uppercase tracking-widest text-[9px] block mb-1 text-slate-400 not-italic">{t.orders.notes}:</span>
                            "{order.notes}"
                          </div>
                        )}
                        {order.privateNotes && (
                          <div className="w-full bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100/40 italic text-slate-600 text-sm">
                            <span className="font-black uppercase tracking-widest text-[9px] block mb-1 text-emerald-600 not-italic flex items-center gap-1">
                              <Save size={10} /> {t.orders.summary.privateNotes}:
                            </span>
                            "{order.privateNotes}"
                          </div>
                        )}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          {(order.status?.toLowerCase() === "processing" || order.status === "Processing") && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="flex-1 md:flex-none bg-rose-50 text-rose-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
                            >
                              <XCircle size={16} />
                              {t.orders.cancelOrder}
                            </button>
                          )}
                          {order.downloadUrl && order.downloadUrl !== "#" && (
                            <a 
                              href={order.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl"
                            >
                              <Download size={16} />
                              {lang === "en" ? "Download" : "Buufadhu"}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Status Tracking Timeline */}
                      <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100/50">
                        <div className="flex items-center justify-between mb-8">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Status Tracking</p>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              order.status === "completed" || order.status === "success" ? "bg-emerald-500" : "bg-amber-500"
                            )} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{order.status}</span>
                          </div>
                        </div>
                        <OrderStatusTimeline status={order.status} lang={lang} />
                        <OrderTrackingMap orderId={order.id} status={order.status} lang={lang} />
                      </div>

                      {["completed", "delivered", "success"].includes(order.status?.toLowerCase()) && (
                        <div className="bg-emerald-50/30 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="space-y-1 text-center md:text-left">
                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{t.orders.rating.title}</h4>
                            <p className="text-sm text-slate-500 font-medium italic">
                              {lang === "en" ? "How was your experience with this order?" : "Muuxannoon keessan ajaja kanaan akkam ture?"}
                            </p>
                          </div>
                          <StarRating 
                            rating={order.rating || 0} 
                            onRate={(r) => handleRateOrder(order.id, r)} 
                            disabled={!!order.rating}
                          />
                        </div>
                      )}

                      {["shipped", "delivered"].includes(order.status?.toLowerCase()) && (
                        <div className="mt-4">
                          <button
                            onClick={() => setExpandedShippingOrders(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                            className={cn(
                              "w-full flex items-center justify-between p-6 bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-all",
                              expandedShippingOrders[order.id] ? "rounded-t-[2.5rem] border-b-0" : "rounded-[2.5rem]"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Truck size={20} />
                              </div>
                              <span className="text-sm font-black uppercase tracking-widest text-slate-900">{t.orders.shippingDetails.title}</span>
                            </div>
                            {expandedShippingOrders[order.id] ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                          </button>
                          
                          <AnimatePresence>
                            {expandedShippingOrders[order.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="p-8 bg-slate-50/30 border-x border-b border-slate-100 rounded-b-[2.5rem] grid grid-cols-1 md:grid-cols-3 gap-8">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.orders.shippingDetails.trackingNumber}</p>
                                    <p className="text-sm font-black text-slate-900 font-mono">{order.trackingNumber || `DB-${order.id.slice(0, 8).toUpperCase()}`}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.orders.shippingDetails.carrier}</p>
                                    <p className="text-sm font-black text-slate-900">{order.carrier || "Dure Boru Express"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.orders.shippingDetails.estimatedDelivery}</p>
                                    <p className="text-sm font-black text-slate-900">
                                      {order.estimatedDelivery || (order.createdAt?.toDate ? new Date(order.createdAt.toDate().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : "TBD")}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activePage === "wishlist" && (
            <WishlistPage
              wishlistItems={wishlistItems}
              toggleWishlist={toggleWishlist}
              handleBuyProduct={handleBuyProduct}
              setActivePage={setActivePage}
              lang={lang}
              translations={translations[lang]}
            />
          )}

          {activePage === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto px-6 py-12 space-y-12"
            >
              <div className="space-y-4 text-center">
                <h2 className="text-5xl font-black tracking-tighter text-slate-900">{t.orders.profile.title}</h2>
                <p className="text-xl text-slate-500 font-medium italic">
                  {lang === "en" ? "Manage your digital identity." : "Eenyummaa keessan dijitaalaa bulchaa."}
                </p>
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-12 relative overflow-hidden">
                {/* Profile View / Edit Mode Toggle Header */}
                <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-wider">
                      {isEditingProfile ? (lang === "en" ? "Editing Mode" : "Gulaalaa") : (lang === "en" ? "Viewer Mode" : "Ilaalaa")}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditingProfile) {
                        if (profile) {
                          setEditProfileName(profile.displayName || "");
                          setEditProfilePhone(profile.phoneNumber || "");
                          setEditProfileBio(profile.bio || "");
                          setEditProfilePhoto(profile.photoURL || "");
                        }
                        setIsEditingProfile(false);
                      } else {
                        setIsEditingProfile(true);
                      }
                    }}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    <Edit size={14} />
                    {isEditingProfile ? (lang === "en" ? "Cancel" : "Haqi") : t.orders.profile.editProfile}
                  </button>
                </div>

                {!isEditingProfile ? (
                  /* Viewer Mode Container */
                  <div className="space-y-12">
                    {/* Avatar Section */}
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="relative group">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-50 flex items-center justify-center">
                          {profile?.photoURL ? (
                            <img src={profile.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User size={64} className="text-slate-200" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.displayName}</h3>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{profile?.email}</p>
                        </div>
                        {profile?.bio && (
                          <p className="text-slate-600 font-medium italic max-w-xl leading-relaxed">
                            "{profile.bio}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-slate-50" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.orders.profile.fullName}</label>
                        <div className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold">
                          {profile?.displayName}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                        <div className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold">
                          {profile?.email}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.orders.profile.phoneNumber}</label>
                        <div className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold">
                          {profile?.phoneNumber || (lang === "en" ? "Not Provided" : "Hanga ammaatti hin guutamne")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.orders.profile.bio}</label>
                        <div className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-medium italic min-h-[4rem]">
                          {profile?.bio || (lang === "en" ? "No bio written yet." : "Eenyummeessaa barreessaa.")}
                        </div>
                      </div>
                    </div>

                    {profile?.role === "admin" && (
                      <div className="mt-8 p-8 bg-gradient-to-r from-blue-900 to-slate-900 rounded-[2.5rem] border border-blue-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_40%)] pointer-events-none" />
                        <div className="space-y-2 text-center md:text-left relative z-10">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest rounded-full">
                            Authorized Administrator
                          </span>
                          <h4 className="text-xl font-black tracking-tight text-white">System Settings & Reports Available</h4>
                          <p className="text-xs text-slate-300 font-medium max-w-xl">
                            {lang === "en"
                              ? "As an admin, you can manage e-commerce products, newsletter lists, client-side orders, and download official setup guides."
                              : "Akka bulchaatti, oomishoota gabayaa, miseensota daddabaloo, ajajawwan gabayaa, fi gabaasa sirnaa buufachuu dandeessu."}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActivePage("admin");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/10 hover:scale-[1.03] active:scale-[0.97] cursor-pointer relative z-10 whitespace-nowrap"
                        >
                          Open Admin Panel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Editable Mode Form */
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="relative">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-emerald-500/30 shadow-inner bg-slate-50 flex items-center justify-center relative">
                          {editProfilePhoto ? (
                            <img src={editProfilePhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User size={64} className="text-slate-200" />
                          )}
                          {isUploadingProfilePic && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                              <Loader2 className="animate-spin" size={24} />
                            </div>
                          )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110">
                          <Upload size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                          <p className="text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">{t.orders.profile.selectAvatar}</p>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {AVATAR_OPTIONS.map((avatar, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setEditProfilePhoto(avatar)}
                                className={cn(
                                  "w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95",
                                  editProfilePhoto === avatar ? "border-emerald-500 shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                              >
                                <img src={avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {t.orders.profile.customPhotoUrl}
                          </label>
                          <input
                            type="text"
                            value={editProfilePhoto}
                            onChange={(e) => setEditProfilePhoto(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3 text-xs font-semibold outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-50" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.orders.profile.fullName}</label>
                        <input
                          type="text"
                          required
                          value={editProfileName}
                          onChange={(e) => setEditProfileName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-3xl px-8 py-5 text-sm font-semibold text-slate-900 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.orders.profile.phoneNumber}</label>
                        <input
                          type="tel"
                          placeholder="+2519..."
                          value={editProfilePhone}
                          onChange={(e) => setEditProfilePhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-3xl px-8 py-5 text-sm font-semibold text-slate-900 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.orders.profile.bio}</label>
                        <textarea
                          rows={4}
                          value={editProfileBio}
                          onChange={(e) => setEditProfileBio(e.target.value)}
                          placeholder={lang === "en" ? "Tell us about yourself..." : "Odeeffannoo waa'ee keessanii barreeffamaan dhiyeessaa..."}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-3xl px-8 py-5 text-sm font-medium text-slate-800 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (profile) {
                            setEditProfileName(profile.displayName || "");
                            setEditProfilePhone(profile.phoneNumber || "");
                            setEditProfileBio(profile.bio || "");
                            setEditProfilePhoto(profile.photoURL || "");
                          }
                          setIsEditingProfile(false);
                        }}
                        className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                      >
                        {lang === "en" ? "Cancel" : "Haqi"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {isSavingProfile ? (
                          <>
                            <Loader2 className="animate-spin" size={14} />
                            {t.orders.profile.saving}
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            {t.orders.profile.saveChanges}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="h-px bg-slate-50" />
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Saved Posts</h3>
                  <div className="space-y-4">
                    {posts.filter(post => savedPosts.includes(post.id)).length === 0 ? (
                      <p className="text-slate-500 italic">No saved posts yet.</p>
                    ) : (
                      posts.filter(post => savedPosts.includes(post.id)).map(post => (
                        <div key={post.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="font-bold text-slate-900">{post.authorName}</p>
                          <p className="text-sm text-slate-600">{post.content.substring(0, 100)}...</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "social" && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto px-6 py-12 space-y-8"
            >
              <div className="space-y-4 text-center">
                <h2 className="text-5xl font-black tracking-tighter text-slate-900">{t.social?.title}</h2>
                <p className="text-xl text-slate-500 font-medium italic">
                  {t.social?.subtitle}
                </p>
              </div>

              {/* Post Composer */}
              {user && (
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden">
                      {profile?.photoURL ? (
                        <img src={profile.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={t.social?.postPlaceholder}
                      className="flex-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-24 font-medium text-slate-900"
                    />
                  </div>
                  {generatedImageUrl && (
                    <div className="mt-4">
                      <img src={generatedImageUrl} alt="Preview" className="w-full h-48 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                    <div className="relative flex-1 w-full group">
                      <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                      <input 
                        type="url"
                        placeholder="Attach Video URL (YouTube, MP4)..."
                        value={newPostVideoUrl}
                        onChange={(e) => setNewPostVideoUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <label className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer select-none">
                        {isUploadingSocial ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            {socialUploadProgress !== null ? `${socialUploadProgress}%` : "Uploading"}
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            Upload File
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*,video/*" 
                          disabled={isUploadingSocial}
                          className="hidden" 
                          onChange={handleSocialFileSelect} 
                        />
                      </label>
                      <button
                        onClick={handleGenerateImage}
                        disabled={isGenerating || !newPostContent.trim()}
                        className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Image size={14} />}
                        AI Image
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={isPosting || isUploadingSocial || !newPostContent.trim()}
                        className="flex-1 sm:flex-none px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isPosting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {t.social?.postButton}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit mx-auto">
                <button
                  onClick={() => setActiveSocialTab("community")}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeSocialTab === "community" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t.social?.communityPosts}
                </button>
                <button
                  onClick={() => setActiveSocialTab("jemal")}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeSocialTab === "jemal" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t.social?.jemalPosts}
                </button>
              </div>

              {/* Interactive Social Media Linking & Sharing Hub */}
              <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
                <div className="text-center md:text-left border-b border-slate-100 pb-6 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest border border-sky-100">
                    <Share2 size={14} /> Social Integration Hub
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                    {lang === "en" ? "Link Accounts & Cross-Post" : "Akaawuntii Hidhi & Maxxansi"}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm">
                    {lang === "en" ? "Connect your Telegram, Facebook, YouTube, & TikTok accounts to draft and share content instantly!" : "Telegram, Facebook, YouTube, fi TikTok keessan hidhuun odeeffannoo fi barruulee qoodaa!"}
                  </p>
                </div>

                {/* Grid for Connecting and Sharing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Column 1: Connection status indicators */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {lang === "en" ? "Your Connected Accounts" : "Akaawuntota Keessan Kanneen Hidhame"}
                    </h4>
                    
                    <div className="space-y-3">
                      {[
                        { key: "telegram", label: "Telegram", icon: Send, color: "text-[#0088cc] bg-[#0088cc]/10 border-[#0088cc]/20" },
                        { key: "facebook", label: "Facebook", icon: Facebook, color: "text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/20" },
                        { key: "youtube", label: "YouTube", icon: Youtube, color: "text-[#FF0000] bg-[#FF0000]/10 border-[#FF0000]/20" },
                        { key: "tiktok", label: "TikTok", icon: Music, color: "text-[#000000] bg-[#000000]/5 border-[#000000]/10" }
                      ].map((item) => {
                        const account = socialAccounts[item.key];
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={item.key}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border transition-all",
                              account.connected ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50 border-slate-100"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", item.color)}>
                                <IconComponent size={20} />
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm">{item.label}</p>
                                <p className="text-xs font-medium text-slate-400">
                                  {account.connected ? `@${account.username}` : (lang === "en" ? "Not Connected" : "Hin Hidhame")}
                                </p>
                              </div>
                            </div>

                            {account.connected ? (
                              <button
                                onClick={() => handleDisconnectSocialAccount(item.key)}
                                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                              >
                                {lang === "en" ? "Disconnect" : "Addaan Kuti"}
                              </button>
                            ) : (
                              <button
                                onClick={() => setIsConnectModalOpen(item.key)}
                                className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 hover:text-white text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                              >
                                {lang === "en" ? "Link Account" : "Hidhi"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Quick Social Composer */}
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500 animate-pulse" />
                      {lang === "en" ? "Quick Cross-Post Assistant" : "Maxxansituu Gara Miidiyaalee Hunda"}
                    </h4>

                    <div className="space-y-3">
                      {/* Select target platform */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Primary Platform" : "Miidiyaa Guddaa"}</label>
                        <select
                          value={socialSharePlatform}
                          onChange={(e) => setSocialSharePlatform(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="telegram">Telegram</option>
                          <option value="facebook">Facebook</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                      </div>

                      {/* Content Box */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === "en" ? "Post Content" : "Yaada Maxxansaa"}</label>
                        <textarea
                          rows={3}
                          placeholder={lang === "en" ? "Write or paste what you want to share..." : "Yaada gara miidiyaa hawaasaatti maxxansuu barbaaddan barreessaa..."}
                          value={socialSharePostContent}
                          onChange={(e) => setSocialSharePostContent(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 resize-none"
                        />
                      </div>

                      {/* Share button */}
                      <button
                        onClick={handleShareToConnectedSocials}
                        disabled={isSharingToSocial || !socialSharePostContent.trim()}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10"
                      >
                        {isSharingToSocial ? <Loader2 className="animate-spin" size={14} /> : <Share2 size={12} />}
                        {lang === "en" ? "Share To Connected Accounts" : "Gara Accounts Keessanitti Maxxansi"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Link Social Account Modal */}
              <AnimatePresence>
                {isConnectModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md"
                    onClick={() => setIsConnectModalOpen(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 30 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl relative space-y-6"
                    >
                      <button
                        onClick={() => setIsConnectModalOpen(null)}
                        className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full"
                      >
                        <X size={16} />
                      </button>

                      <div className="text-center space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                          Link Account
                        </span>
                        <h4 className="text-2xl font-black text-slate-900 capitalize">
                          Connect {isConnectModalOpen}
                        </h4>
                        <p className="text-slate-400 text-xs font-medium">
                          {lang === "en" 
                            ? `Enter your ${isConnectModalOpen} username or channel handle to link with Dure Boru.` 
                            : `Akaawuntii keessan ${isConnectModalOpen} Dure Boruu wajjin walitti hidhuuf maqaa keessan barreessaa.`}
                        </p>
                      </div>

                      <form onSubmit={handleConnectSocialAccount} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {lang === "en" ? "Username / Handle" : "Maqaa / Handle"}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                            <input
                              type="text"
                              required
                              placeholder="dure_boru_official"
                              value={socialConnectUsername}
                              onChange={(e) => setSocialConnectUsername(e.target.value)}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium focus:outline-none focus:border-emerald-500 text-sm"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md"
                        >
                          {lang === "en" ? "Link Account Now" : "Akaawuntii Hidhi Amma"}
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feed */}
              <div className="space-y-6">
                {posts
                  .filter(post => activeSocialTab === "community" ? true : post.isJemal)
                  .length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">{t.social?.noPosts}</p>
                  </div>
                ) : (
                  posts
                    .filter(post => activeSocialTab === "community" ? true : post.isJemal)
                    .map((post) => (
                    <motion.div
                      key={post.id}
                      id={`post-${post.id}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6",
                        post.isJemal && "border-emerald-200 bg-emerald-50/20"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                            {post.authorPhoto ? (
                              <img src={post.authorPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-900">{post.authorName}</h4>
                              {post.isJemal && (
                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                                  <Sparkles size={8} /> Verified Creator
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "Just now"}
                              {" • "}
                              {Math.max(1, Math.ceil((post.content || "").trim().split(/\s+/).length / 200))} min read
                            </p>
                          </div>
                        </div>
                        {post.isJemal && <Star size={20} className="text-emerald-500 fill-emerald-500" />}
                      </div>

                      <motion.div layout className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                        {(post.content || "").length > 300 && !expandedPosts[post.id] ? (
                          <>
                            {(post.content || "").substring(0, 300)}...
                            <button 
                              onClick={() => togglePostExpansion(post.id)}
                              className="text-emerald-600 font-bold ml-2 hover:underline"
                            >
                              Read More
                            </button>
                          </>
                        ) : (
                          <>
                            {post.content}
                            {(post.content || "").length > 300 && expandedPosts[post.id] && (
                              <button 
                                onClick={() => togglePostExpansion(post.id)}
                                className="text-emerald-600 font-bold ml-2 hover:underline"
                              >
                                Show Less
                              </button>
                            )}
                          </>
                        )}
                      </motion.div>
                      {post.videoUrl && (
                        <div className="mt-4">
                          <ResponsiveVideoPlayer url={post.videoUrl} />
                        </div>
                      )}
                      {post.imageUrl && !post.videoUrl && (
                        <div className="mt-4">
                          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover rounded-2xl" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                        <motion.button 
                          whileTap={{ scale: 0.85, rotate: -10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          onClick={() => handleLikePost(post)}
                          className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                            post.likedBy?.includes(user?.uid || "") ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          <motion.div
                             animate={{ scale: post.likedBy?.includes(user?.uid || "") ? [1, 1.2, 1] : 1 }}
                             transition={{ duration: 0.3 }}
                          >
                            <ThumbsUp size={16} className={cn(post.likedBy?.includes(user?.uid || "") && "fill-rose-500")} />
                          </motion.div>
                          {post.likes || 0} {t.social?.like}
                        </motion.button>
                        <button 
                          onClick={() => handleSharePost(post.id)}
                          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <Share2 size={16} />
                          {t.social?.share}
                        </button>
                        <button
                          onClick={() => handleToggleBookmark(post)}
                          className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                            savedPosts.includes(post.id) ? "text-emerald-500" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          <Bookmark size={16} className={cn(savedPosts.includes(post.id) && "fill-emerald-500")} />
                          {savedPosts.includes(post.id) ? "Saved" : "Save"}
                        </button>
                      </div>
                      <CommentsList postId={post.id} user={user} db={db} t={t} />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activePage === "durePay" && (
            <motion.div
              key="durePay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto px-6 py-12"
            >
              <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
                <div className="bg-[#111] p-12 text-white space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                      <Wallet size={28} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{t.durePay.balance}</p>
                      <p className="text-3xl font-black tracking-tighter">ETB 45,920.00</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg">
                      {t.durePay.send}
                    </button>
                    <button className="py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                      Deposit
                    </button>
                  </div>
                </div>
                
                <div className="p-12 space-y-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-2xl tracking-tight">{t.durePay.history}</h4>
                      <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-100 hover:text-emerald-700 transition-all"
                      >
                        <Download size={14} />
                        {t.durePay.exportCSV}
                      </button>
                    </div>
                    <div className="overflow-hidden bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.durePay.merchant}</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.durePay.date}</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.durePay.status}</th>
                              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">{t.durePay.amount}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { name: "Digital Academy Course", date: "Jul 05, 2026", status: "success", amount: "-1,200" },
                              { name: "Marketplace Sale", date: "Jul 04, 2026", status: "success", amount: "+2,450" },
                              { name: "Subscription Renewal", date: "Jul 03, 2026", status: "failed", amount: "-500" },
                              { name: "P2P Transfer", date: "Jul 02, 2026", status: "success", amount: "+1,000" },
                            ].map((tx, i) => (
                              <tr key={i} className="group hover:bg-white transition-colors">
                                <td className="px-6 py-5">
                                  <p className="font-black text-slate-900">{tx.name}</p>
                                </td>
                                <td className="px-6 py-5">
                                  <p className="text-sm font-bold text-slate-500">{tx.date}</p>
                                </td>
                                <td className="px-6 py-5">
                                  <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    tx.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                  )}>
                                    {tx.status === "success" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {tx.status === "success" ? t.durePay.success : t.durePay.failed}
                                  </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  <p className={cn(
                                    "font-black",
                                    tx.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"
                                  )}>
                                    ETB {tx.amount}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-black text-xl tracking-tight">Active Payment Methods</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { name: t.durePay.paymentMethods.telebirr, color: "bg-blue-600", icon: Zap },
                        { name: t.durePay.paymentMethods.cbe, color: "bg-purple-700", icon: Wallet },
                        { name: t.durePay.paymentMethods.wallet, color: "bg-emerald-600", icon: CircleDollarSign },
                      ].map((method, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center gap-4">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", method.color)}>
                            <method.icon size={20} />
                          </div>
                          <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">{method.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      className="flex-1 py-6 bg-emerald-600 text-white rounded-full font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3"
                    >
                      <Zap size={24} />
                      {t.durePay.simulate}
                    </button>
                    <button 
                      onClick={() => setShowQR(true)}
                      className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
                      title={t.durePay.generateQR}
                    >
                      <QrCode size={28} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-6xl mx-auto px-6 py-12 space-y-16 animate-none"
            >
              {/* Header / Hero Section */}
              <div className="text-center space-y-6 max-w-4xl mx-auto">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100"
                >
                  <Info size={14} /> {lang === "en" ? "Who We Are" : "Nuyi Eenyu?"}
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
                  {lang === "en" ? "DURE BORU Center" : "Giddu-gala DURE BORU"}
                </h1>
                <p className="text-xl md:text-2xl text-blue-600 font-extrabold max-w-3xl mx-auto leading-relaxed">
                  {lang === "en" 
                    ? "DURE BORU Digital Research, Production, Sales, and Market Center" 
                    : "Giddu-gala Omisha Qo'annaa fi Gurgurtaafi Gabaa digitaala DURE BORU"}
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 mx-auto rounded-full" />
              </div>

              {/* Mission & Vision Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mission Card */}
                <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm">
                      <Sparkles size={28} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                      {lang === "en" ? "Our Mission" : "Ergaa Keenya"}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-lg">
                      {lang === "en" 
                        ? "To empower Ethiopian communities, farmers, youth, and businesses through cutting-edge digital integration, sustainable agricultural innovations, world-class education, and advanced financial services."
                        : "Muxannoo qonnaan bultootaa, dargaggoota fi daldaltoota Itoophiyaa teeknoolojii hammayyaa, barnoota addunyaa, fi tajaajila kaffaltii ammayyeessuun qabeenya fi badhaadhina uumuu."}
                    </p>
                  </div>
                  <div className="pt-8 text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    {lang === "en" ? "Empowering Tomorrow" : "Boruu Badhaadhaa"} <ArrowRight size={14} />
                  </div>
                </div>

                {/* Vision Card */}
                <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center border border-blue-100 shadow-sm">
                      <Globe size={28} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                      {lang === "en" ? "Our Vision" : "Mul'ata Keenya"}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-lg">
                      {lang === "en" 
                        ? "To be the leading digital gateway for sustainable prosperity, transformation, and direct marketplace connection in East Africa."
                        : "Afrikaa Bahaatti riqicha gabaa wal-qunnamsiisuu fi badhaadhina waaraa fiduuf giddu-gala dijitaalaa filatamaa ta'uu."}
                    </p>
                  </div>
                  <div className="pt-8 text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    {lang === "en" ? "Expanding Horizons" : "Mul'ata Bal'aa"} <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Five Pillars Section */}
              <div className="space-y-12 animate-none">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">
                    {lang === "en" ? "Our Five Development Pillars" : "Utubaa Misooma Keenya Shanan"}
                  </h2>
                  <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                    {lang === "en" 
                      ? "A holistic, integrated approach combining technology, education, commerce, and finance." 
                      : "Waliin fi unkaalee hammayyaa walitti makuun teeknoolojii, barnoota, daldala, fi kaffaltii qindeessuu."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    {
                      id: "agriculture",
                      title: lang === "en" ? "Modern Agriculture" : "Qonna Hammayyaa",
                      desc: lang === "en" ? "Transforming traditional farming into precision, highly productive agri-tech ecosystems." : "Muxannoo qonna durii gara teeknoolojii qonna ammayyaafi omishtummaa olaanaatti jijjiiruu.",
                      color: "emerald",
                      icon: Leaf,
                    },
                    {
                      id: "academy",
                      title: lang === "en" ? "Digital Academy" : "Akadaamii Dijitaalaa",
                      desc: lang === "en" ? "Empowering the next generation with software engineering, AI, and creative technology skills." : "Dargaggoota keenya dandeettii pirograamiingii, AI, fi saayinsii teeknoolojiin qopheessuu.",
                      color: "blue",
                      icon: GraduationCap,
                    },
                    {
                      id: "marketplace",
                      title: lang === "en" ? "Ethical Commerce" : "Daldala Dijitaalaa",
                      desc: lang === "en" ? "Direct marketplace access for farmers and producers to sell directly to consumers without intermediaries." : "Riqicha gabaa kallattii qonnaan bultootaa fi fayyadamtoota gidduutti uumuu.",
                      color: "amber",
                      icon: ShoppingBag,
                    },
                    {
                      id: "durePay",
                      title: lang === "en" ? "Secure Payments" : "Kaffaltii Dure Pay",
                      desc: lang === "en" ? "Modern payment, transaction, and wallet systems enabling seamless commerce across Ethiopia." : "Tajaajila kaffaltii fi herrega baankii teeknoolojii olaanaan deggerame uumuu.",
                      color: "purple",
                      icon: Wallet,
                    },
                    {
                      id: "social",
                      title: lang === "en" ? "Social Community" : "Hawaasummaa",
                      desc: lang === "en" ? "Creating digital safe spaces for collaboration, research sharing, and open agricultural discourse." : "Bakka qorannoo qooduufi waliin hojjechuuf gargaaru uumuu.",
                      color: "rose",
                      icon: Users2,
                    },
                  ].map((pillar, i) => {
                    const Icon = pillar.icon;
                    return (
                      <div 
                        key={i}
                        onClick={() => {
                          setActivePage(pillar.id as Page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md hover:shadow-xl hover:border-emerald-500/20 cursor-pointer transition-all duration-300 group flex flex-col justify-between space-y-6"
                      >
                        <div className="space-y-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                            pillar.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                            pillar.color === "blue" ? "bg-blue-50 text-blue-600" :
                            pillar.color === "amber" ? "bg-amber-50 text-amber-600" :
                            pillar.color === "purple" ? "bg-purple-50 text-purple-600" : "bg-rose-50 text-rose-600"
                          )}>
                            <Icon size={24} />
                          </div>
                          <h4 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {pillar.title}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                          {lang === "en" ? "Explore" : "Ilaali"} <ArrowRight size={10} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Section */}
              <AboutTimeline lang={lang} />

              {/* Foundational Leader Section */}
              <div className="bg-slate-900 text-white rounded-[4rem] p-10 md:p-16 relative overflow-hidden shadow-2xl animate-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                  <div className="lg:col-span-4 flex flex-col items-center text-center space-y-6">
                    <div className="w-56 h-56 rounded-[3rem] overflow-hidden border-4 border-emerald-500/30 shadow-2xl bg-slate-800 relative group flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-blue-600/20" />
                      <User size={96} className="text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {lang === "en" ? "Developer" : "Hojjataa"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-lg text-white">Jemal Fano Haji</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === "en" ? "Age 42" : "Waggaa 42"}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-8">
                    <div className="space-y-3">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                        <ShieldCheck size={12} />
                        {lang === "en" ? "Verified Lead Architect" : "Mirkaneessaa Hojii"}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-black tracking-tighter">
                        Jemaal Faanoo Haajii
                      </h3>
                      <p className="text-emerald-400 font-extrabold uppercase tracking-widest text-xs">
                        {lang === "en" ? "Lead Developer & Systems Administrator" : "Hojjataa Teeknooloojii fi Giddu-gala Ol-aanaa"}
                      </p>
                    </div>

                    <p className="text-slate-300 font-medium leading-relaxed">
                      {lang === "en" 
                        ? "Under the vision of Jemal Fano Haji, Dure Boru is designed and managed to monetize and deliver high-value digital files, agricultural guidelines, software applications, slide templates, video training, and website templates to empower the local Ethiopian technology community."
                        : "Mul'ata Jemaal Faanoo Haajiitiin, Dure Boru gurgurtaa fi raabsa dambaliiwwan dabalataa, barreeffamoota, dizaayinii fi vidiyoolee leenjii adda addaa hawaasa teeknoolojii Itoophiyaaf dhiyeessuuf gurmaa'e."}
                    </p>

                    {/* Developer Credentials Bento Sub-Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl space-y-2 flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {lang === "en" ? "Education" : "Barnoota"}
                          </p>
                          <p className="text-sm font-black text-white mt-1">IT BSc Degree</p>
                          <p className="text-xs text-slate-400">Information Technology Specialist</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl space-y-2 flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {lang === "en" ? "Address" : "Teessoo"}
                          </p>
                          <p className="text-sm font-black text-white mt-1">Kore Woreda</p>
                          <p className="text-xs text-slate-400">West Arsi Zone, Oromia, Ethiopia</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl space-y-2 flex items-start gap-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                          <Send size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {lang === "en" ? "Secure Email" : "Imeelii Iccitii"}
                          </p>
                          <p className="text-sm font-black text-white mt-1 font-mono">jemalfan030@gmail.com</p>
                          <p className="text-xs text-slate-400">Primary Contact Gateway</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl space-y-2 flex items-start gap-4">
                        <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {lang === "en" ? "Direct Wallet Support" : "Deeggarsa Boorsaa Kaffaltii"}
                          </p>
                          <p className="text-sm font-black text-white mt-1 font-mono">+251995852194</p>
                          <p className="text-xs text-slate-400">Telebirr & CBE Birr Accounts Connected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation (YE-BUNA Style) */}
      <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-full p-2 flex gap-1 shadow-2xl pointer-events-auto max-w-fit">
          <NavItem page="home" icon={Home} label="Home" />
          <NavItem page="marketplace" icon={ShoppingBag} label="Shop" />
          <NavItem page="social" icon={MessageCircle} label="Social" />
          <NavItem page="academy" icon={Users2} label="Club" />
          <NavItem page="durePay" icon={CircleDollarSign} label="Earn" />
          <NavItem page="about" icon={Info} label={lang === "en" ? "About" : "Waa'ee"} />
          {user && <NavItem page="profile" icon={User} label="Profile" />}
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-24 right-8 z-[60]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
              <div className="bg-[#111] p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-black tracking-tight">AI Assistant</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              </div>
              
              <div className="h-[400px] overflow-y-auto p-8 space-y-6 bg-slate-50/50">
                {chatHistory.length === 0 && (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                      <MessageCircle size={40} />
                    </div>
                    <p className="text-sm font-bold text-slate-500 px-6 uppercase tracking-widest leading-loose">
                      {lang === "en" 
                        ? "Welcome to Dure Boru. Ask me anything about agriculture, education, or payments." 
                        : "Baga nagaan dhuftan. Qonna, barnootaa fi kaffaltii irratti waan barbaaddan na gaafadhaa."}
                    </p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === "user" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-100"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-6 py-4 rounded-[2rem] shadow-sm flex items-center gap-3 border border-slate-100">
                      <Loader2 size={18} className="animate-spin text-emerald-600" />
                      <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Processing</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder={lang === "en" ? "Send a message..." : "Yaada keessan barreessaa..."}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button 
                  onClick={handleSendChat}
                  disabled={!chatMessage.trim() || isTyping}
                  className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "w-20 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110",
            isChatOpen ? "bg-[#111] text-white" : "bg-emerald-600 text-white ring-8 ring-emerald-600/10"
          )}
        >
          {isChatOpen ? <X size={36} /> : <MessageCircle size={36} />}
        </button>
      </div>

      {/* Floating Bottom Navigation (Mobile/Compact) */}
      <div className="fixed bottom-6 left-4 right-4 z-[100] md:hidden">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-100 p-1.5 rounded-[2rem] shadow-2xl flex items-center justify-between">
          {[
            { id: "home", label: t.nav.home, icon: Home },
            { id: "agriculture", label: t.nav.agriculture, icon: Leaf },
            { id: "academy", label: t.nav.academy, icon: GraduationCap },
            { id: "marketplace", label: t.nav.marketplace, icon: ShoppingBag },
            { id: "social", label: lang === "en" ? "Social" : "Soshaala", icon: MessageCircle },
            { id: "durePay", label: t.nav.durePay, icon: Wallet },
            ...(user ? [{ id: "profile", label: "Profile", icon: User }] : []),
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id as Page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-300 rounded-xl",
                activePage === item.id 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "text-slate-400 hover:text-emerald-600"
              )}
            >
              <item.icon size={16} fill={activePage === item.id ? "currentColor" : "none"} />
              <span className={cn("text-[7px] md:text-[8px] font-black uppercase tracking-tight truncate max-w-full px-0.5", activePage === item.id ? "text-emerald-600 font-extrabold" : "text-slate-400")}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-20 px-6 pb-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-[#d4af37] flex items-center justify-center bg-amber-50">
                <img
                  src={DURE_BORU_LOGO}
                  alt="Dure Boru Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 bg-clip-text text-transparent uppercase flex items-center gap-1">
                DURE BORU <span className="text-sm">🥇</span>
              </span>
            </div>
            <p className="text-slate-900 font-black tracking-widest text-xs uppercase ml-1">Jemal Fano Haji</p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
              {lang === "en" ? "Subscribe to our Newsletter" : "Oduu Haaraa Keenya Hordofaa"}
            </h4>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
              <input 
                type="email" 
                placeholder={lang === "en" ? "Enter your email" : "Iimeeyilii keessan galchaa"}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={isSubscribing}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isSubscribing}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isSubscribing ? <Loader2 className="animate-spin" size={20} /> : (lang === "en" ? "Subscribe" : "Galmoofadhu")}
              </button>
            </form>
            {subscribeMessage.text && (
              <p className={cn("text-xs font-black uppercase tracking-widest mt-2", subscribeMessage.type === "success" ? "text-emerald-600" : "text-rose-500")}>
                {subscribeMessage.text}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4">
              {[
                { id: "home", label: t.nav.home },
                { id: "agriculture", label: t.nav.agriculture },
                { id: "academy", label: t.nav.academy },
                { id: "marketplace", label: t.nav.marketplace },
                { id: "social", label: lang === "en" ? "Social" : "Soshaala" },
                { id: "durePay", label: t.nav.durePay },
                { id: "about", label: t.nav.about },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setActivePage(item.id as Page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-all",
                    activePage === item.id ? "text-emerald-600 font-extrabold" : "text-slate-400 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#E4405F]/10 flex items-center justify-center text-[#E4405F] hover:bg-[#E4405F]/20 transition-all group" aria-label="Instagram">
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition-all group" aria-label="Facebook">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] hover:bg-[#0088cc]/20 transition-all group" aria-label="Telegram">
                <Send size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000]/20 transition-all group" aria-label="YouTube">
                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#000000]/10 flex items-center justify-center text-[#000000] hover:bg-[#000000]/20 transition-all group" aria-label="TikTok">
                <Music size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center md:text-right">
              © 2026 Dure Boru Platform. Empowering Ethiopian Excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedProductForPurchase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductForPurchase(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600">
                    <ShoppingBag size={32} />
                  </div>
                  <button 
                    onClick={() => setSelectedProductForPurchase(null)}
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900">
                    {lang === "en" ? "Confirm Purchase" : "Bittaa Mirkaneessi"}
                  </h2>
                  <p className="text-slate-500 font-medium italic">
                    {selectedProductForPurchase.name} — {currency === "ETB" ? "ETB" : "$"} { 
                      currency === "ETB" 
                        ? selectedProductForPurchase.price.toLocaleString() 
                        : (selectedProductForPurchase.price / EXCHANGE_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                    }
                  </p>
                </div>

                {/* Secure Privacy Payment Gateway Section */}
                <div className="space-y-4 p-6 bg-slate-50/70 border border-slate-100 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      {lang === "en" ? "SECURE P2P GATEWAY" : "KARA KAFFALTII AMANSIISAA"}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-full tracking-wider">
                      {lang === "en" ? "Verified" : "Mirkanaa'e"}
                    </span>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("telebirr")}
                      className={cn(
                        "py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex flex-col items-center gap-1",
                        selectedPaymentMethod === "telebirr"
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <Zap size={14} />
                      Telebirr Secure
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("cbe")}
                      className={cn(
                        "py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex flex-col items-center gap-1",
                        selectedPaymentMethod === "cbe"
                          ? "bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-500/10"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <Wallet size={14} />
                      CBE Birr Secure
                    </button>
                  </div>

                  {/* Merchant/Receiver Credentials Banner */}
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl text-xs space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      {lang === "en" ? "DIRECT RECIPIENT ACCOUNT" : "HERREGA HAFTEE KAFFALTII"}
                    </p>
                    {selectedPaymentMethod === "telebirr" ? (
                      <div>
                        <p className="font-black text-slate-900">Jemal Fano Haji</p>
                        <p className="font-black text-blue-600 tracking-wider text-sm">+251995852194</p>
                        <p className="text-[10px] text-slate-500 mt-1 italic leading-tight">
                          {lang === "en" 
                            ? "Transfer directly to verified administrator's Telebirr account. Your download becomes available immediately." 
                            : "Kaffaltii gara lakkoofsa Telebirr kanaan raawwadhaa. Battalatti gurgurtaa ni argattu."}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-black text-slate-900">Jemal Fano Haji (CBE Wallet)</p>
                        <p className="font-black text-purple-700 tracking-wider text-sm">Commercial Bank of Ethiopia</p>
                        <p className="text-[10px] text-slate-500 mt-1 italic leading-tight">
                          {lang === "en" 
                            ? "Pay securely using Commercial Bank of Ethiopia (CBE) Birr service. Reconciled securely via local node." 
                            : "Kaffaltii amansiisaa CBE Birriin hojjedhaa. Galmeen keessan amansiisaa ta'ee ni olkaa'ama."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payer Phone/Name verification input */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {lang === "en" ? "Your Paying Phone Number / Name" : "Maqaa Ykn Lakkoofsa Bilbilaa Keessan"}
                    </label>
                    <input
                      type="text"
                      required
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder={selectedPaymentMethod === "telebirr" ? "+2519..." : "Your CBE Birr Transfer Name"}
                      className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                    {t.orders.notes}
                  </label>
                  <textarea
                    value={purchaseNote}
                    onChange={(e) => setPurchaseNote(e.target.value)}
                    placeholder={t.orders.notesPlaceholder}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={finalizePurchase}
                  className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
                >
                  <ArrowRight size={18} />
                  {lang === "en" ? "Confirm & Pay" : "Mirkaneessi & Kaffali"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Summary Modal */}
      <AnimatePresence>
        {selectedOrderForSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForSummary(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600">
                    <FileText size={32} />
                  </div>
                  <button 
                    onClick={() => setSelectedOrderForSummary(null)}
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900">
                    {t.orders.summary.title}
                  </h2>
                  <p className="text-slate-500 font-medium italic">
                    {t.orders.summary.details}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t.orders.summary.orderId}</p>
                    <p className="text-sm font-black text-slate-900 font-mono">#{selectedOrderForSummary.id.toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t.orders.summary.date}</p>
                    <p className="text-sm font-black text-slate-900">
                      {selectedOrderForSummary.createdAt?.toDate ? selectedOrderForSummary.createdAt.toDate().toLocaleString() : "Pending"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t.orders.summary.product}</p>
                    <p className="text-sm font-black text-slate-900">{selectedOrderForSummary.productName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t.orders.summary.amount}</p>
                    <p className="text-lg font-black text-emerald-600">
                      {currency === "ETB" ? "ETB" : "$"} {
                        currency === "ETB" 
                          ? (selectedOrderForSummary.amount || 0).toLocaleString() 
                          : ((selectedOrderForSummary.amount || 0) / EXCHANGE_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t.orders.summary.status}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                        ["completed", "success", "delivered"].includes(selectedOrderForSummary.status?.toLowerCase()) ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        selectedOrderForSummary.status?.toLowerCase() === "processing" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        selectedOrderForSummary.status?.toLowerCase() === "shipped" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        selectedOrderForSummary.status?.toLowerCase() === "cancelled" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                        "bg-slate-50 text-slate-700 border border-slate-100"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full animate-pulse",
                          ["completed", "success", "delivered"].includes(selectedOrderForSummary.status?.toLowerCase()) ? "bg-emerald-500" :
                          selectedOrderForSummary.status?.toLowerCase() === "processing" ? "bg-amber-500" :
                          selectedOrderForSummary.status?.toLowerCase() === "shipped" ? "bg-blue-500" :
                          selectedOrderForSummary.status?.toLowerCase() === "cancelled" ? "bg-rose-500" :
                          "bg-slate-500"
                        )} />
                        {lang === "en" ? (
                          selectedOrderForSummary.status?.charAt(0).toUpperCase() + selectedOrderForSummary.status?.slice(1)
                        ) : (
                          selectedOrderForSummary.status?.toLowerCase() === "processing" ? "Hojiirra jira" :
                          selectedOrderForSummary.status?.toLowerCase() === "shipped" ? "Ergameera" :
                          ["completed", "success", "delivered"].includes(selectedOrderForSummary.status?.toLowerCase()) ? "Xumurame" :
                          selectedOrderForSummary.status?.toLowerCase() === "cancelled" ? "Haqameera" :
                          selectedOrderForSummary.status
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrderForSummary.notes && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      {t.orders.summary.notes}
                    </label>
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium italic text-slate-600">
                      "{selectedOrderForSummary.notes}"
                    </div>
                  </div>
                )}

                {/* Private Notes Section */}
                <div className="space-y-3 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/60">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                      <Save size={12} /> {t.orders.summary.privateNotes}
                    </label>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Firestore DB
                    </span>
                  </div>
                  <textarea
                    value={editingPrivateNote}
                    onChange={(e) => setEditingPrivateNote(e.target.value)}
                    placeholder={t.orders.summary.privateNotesPlaceholder}
                    rows={3}
                    className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl p-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 placeholder:italic transition-all resize-none outline-none shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSavePrivateNotes(selectedOrderForSummary.id, editingPrivateNote)}
                      disabled={isSavingPrivateNote || (selectedOrderForSummary.privateNotes || "") === editingPrivateNote}
                      className={cn(
                        "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md",
                        (selectedOrderForSummary.privateNotes || "") === editingPrivateNote
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200/50"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
                      )}
                    >
                      {isSavingPrivateNote ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {lang === "en" ? "Saving..." : "Olkaayamaa..."}
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          {t.orders.summary.saveNotes}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleReorder(selectedOrderForSummary)}
                    className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
                  >
                    <RotateCcw size={18} />
                    {t.orders.summary.reorder}
                  </button>

                  <button
                    onClick={() => handleShareOrder(selectedOrderForSummary)}
                    className="w-full py-6 bg-slate-100 text-slate-900 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                  >
                    <Share2 size={18} />
                    {t.orders.summary.share}
                  </button>

                  <button
                    onClick={() => setSelectedOrderForSummary(null)}
                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    {t.orders.summary.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications Stack */}
      <div id="toast-notifications-container" className="fixed bottom-24 right-6 z-[250] flex flex-col gap-4 max-w-sm w-full pointer-events-none md:bottom-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-white rounded-3xl p-5 shadow-2xl border border-slate-100/80 flex items-start gap-4 relative overflow-hidden"
            >
              {/* Left accent border/glow */}
              <div className={cn(
                "absolute top-0 bottom-0 left-0 w-1.5",
                toast.type === "success" ? "bg-emerald-500" :
                toast.type === "warning" ? "bg-amber-500" : "bg-blue-500"
              )} />
              
              <div className={cn(
                "p-2 rounded-2xl",
                toast.type === "success" ? "bg-emerald-50 text-emerald-600" :
                toast.type === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
              )}>
                {toast.type === "success" ? <CheckCircle2 size={18} /> :
                 toast.type === "warning" ? <XCircle size={18} /> : <Bell size={18} />}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 leading-none mb-1">
                  {toast.title}
                </h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-300 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 absolute top-4 right-4"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Product Details & Reviews Modal */}
      <AnimatePresence>
        {selectedProductForDetails && (
          <ProductDetailsModal
            product={selectedProductForDetails}
            onClose={() => setSelectedProductForDetails(null)}
            user={user}
            profile={profile}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            handleBuyProduct={handleBuyProduct}
            currency={currency}
            EXCHANGE_RATE={EXCHANGE_RATE}
            lang={lang}
            addToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 cursor-zoom-out"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh] z-10"
            >
              <img 
                src={selectedImage} 
                alt="Fullscreen product" 
                className="w-full h-full object-contain rounded-2xl shadow-2xl" 
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
