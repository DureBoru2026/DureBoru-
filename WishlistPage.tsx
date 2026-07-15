import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  Leaf, 
  ShoppingBag, 
  X, 
  Heart,
  ArrowRight,
  Sparkles,
  BookmarkCheck,
  Search,
  ShoppingCart
} from "lucide-react";

interface WishlistPageProps {
  wishlistItems: any[];
  toggleWishlist: (id: string) => Promise<void> | void;
  handleBuyProduct: (product: any) => void;
  setActivePage: (page: any) => void;
  lang: "en" | "om";
  translations: any;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistItems,
  toggleWishlist,
  handleBuyProduct,
  setActivePage,
  lang,
  translations
}) => {
  const [filterType, setFilterType] = useState<"All" | "Marketplace" | "Academy" | "Agriculture">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const t = translations;

  // Filter items
  const filteredItems = wishlistItems.filter(item => {
    const matchesFilter = filterType === "All" || item.type === filterType;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: "All", labelEn: "All Items", labelOm: "Hunda" },
    { id: "Marketplace", labelEn: "Products", labelOm: "Meeshaalee" },
    { id: "Academy", labelEn: "Academy", labelOm: "Barnoota" },
    { id: "Agriculture", labelEn: "Agriculture", labelOm: "Qonna" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      {/* Page Header */}
      <div className="relative mb-10 p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-rose-300 text-xs font-black uppercase tracking-widest border border-white/5">
              <Heart size={12} className="fill-current animate-pulse" />
              <span>{lang === "en" ? "My Collection" : "Kufaama Koo"}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
              {t.orders.wishlist.title}
            </h1>
            <p className="text-slate-300 font-medium text-sm sm:text-base max-w-2xl">
              {lang === "en" 
                ? "Manage and quickly access your saved learning courses, agricultural designs, and premium marketplace products."
                : "Meeshaalee qonnaa, dizaayinii fi barannoowwan filatanii olkaawwatan daddafanii argachuuf dandeessisa."}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md self-start md:self-auto">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Total Saved</p>
              <p className="text-3xl font-black">{wishlistItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filtering Section */}
      {wishlistItems.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200/50">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterType(cat.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterType === cat.id
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/30"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "en" ? cat.labelEn : cat.labelOm}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={lang === "en" ? "Search saved items..." : "Kufaama keessatti barbaadi..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 sm:p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-6 shadow-sm text-center"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-400 shadow-inner">
            <Heart size={44} className="fill-rose-100 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              {wishlistItems.length === 0 
                ? (lang === "en" ? "Your Wishlist is Empty" : "Kufaamni Keessan Duwwaadha")
                : (lang === "en" ? "No Match Found" : "Wanti Argame Hin Jiru")}
            </h3>
            <p className="text-slate-400 text-sm font-medium italic max-w-md mx-auto">
              {wishlistItems.length === 0
                ? (lang === "en" 
                    ? "Explore the marketplace, digital courses, or modern agricultural templates and tap the heart icon to save them here."
                    : "Meeshaalee qonnaa ykn barannoo teeknoolojii jaallattan mallattoo jaalalaa tuquun dabalachuu dandeessu.")
                : (lang === "en" 
                    ? "Try adjusting your search query or switching the category filter."
                    : "Gara kutaalee birootti jijjiiruun ykn barbaaddoo kee sirreessuun yaali.")}
            </p>
          </div>
          <button 
            onClick={() => {
              if (wishlistItems.length === 0) {
                setActivePage("marketplace");
              } else {
                setFilterType("All");
                setSearchQuery("");
              }
            }}
            className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {wishlistItems.length === 0 
              ? t.hero.browse 
              : (lang === "en" ? "Clear Filters" : "Haxaa'i")}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => {
            const isMarket = item.type === "Marketplace";
            const isAcademy = item.type === "Academy";
            const isAgri = item.type === "Agriculture";

            return (
              <motion.div 
                key={item.id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between relative overflow-hidden"
              >
                {/* Visual Category Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isMarket ? "bg-amber-500" : isAcademy ? "bg-blue-600" : "bg-emerald-600"
                }`} />

                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    {/* Category Icon and Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isMarket ? "bg-amber-50 text-amber-600" : isAcademy ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {isAcademy ? <GraduationCap size={24} /> : isAgri ? <Leaf size={24} /> : <ShoppingBag size={24} />}
                      </div>
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${
                          isMarket ? "text-amber-600" : isAcademy ? "text-blue-600" : "text-emerald-600"
                        }`}>
                          {item.type}
                        </p>
                        {item.category && (
                          <span className="text-[10px] text-slate-400 font-bold">{item.category}</span>
                        )}
                      </div>
                    </div>
                    {/* Remove button */}
                    <button 
                      onClick={() => toggleWishlist(item.id)}
                      className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
                      title={lang === "en" ? "Remove from wishlist" : "Kufaama irraa haqi"}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight group-hover:text-slate-800 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {item.desc || item.description || (lang === "en" ? "No description available." : "Ibsi hin jiru.")}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Price</span>
                    <p className="text-lg sm:text-xl font-black text-slate-900">
                      {item.price ? `${item.price.toLocaleString()} ETB` : (lang === "en" ? "Free / Learn" : "Bilisa")}
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      if (isMarket) {
                        handleBuyProduct(item);
                      } else {
                        setActivePage(isAcademy ? "academy" : "agriculture");
                      }
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95 ${
                      isMarket 
                        ? "bg-amber-500 hover:bg-amber-600 text-white" 
                        : "bg-slate-900 hover:bg-black text-white"
                    }`}
                  >
                    {isMarket ? (
                      <>
                        <ShoppingCart size={12} />
                        <span>{lang === "en" ? "Buy Now" : "Kaffali"}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === "en" ? "Explore Hub" : "Gara Hub"}</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
