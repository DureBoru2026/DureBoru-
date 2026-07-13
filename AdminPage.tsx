import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Search,
  ChevronRight,
  Package,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Loader2,
  Video,
  Mail,
  Calendar,
  ArrowDownToLine,
  Youtube,
  Facebook,
  Music,
  Send,
  Megaphone,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink
} from "lucide-react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt?: any;
}

export function AdminNewsletterDashboard({ lang }: { lang: string }) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "newsletter"), orderBy("subscribedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: NewsletterSubscriber[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as NewsletterSubscriber);
      });
      setSubscribers(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching newsletter:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "en" ? "Are you sure you want to remove this subscriber?" : "Subscriber kana haquu akka barbaaddan mirkaneessaa?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "newsletter", id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Email", "Subscribed At"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map(s => {
        const date = s.subscribedAt?.toDate ? s.subscribedAt.toDate().toLocaleString() : "N/A";
        return `${s.email},"${date}"`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === "en" ? "Newsletter Subscribers" : "Miseensota Oduu Haaraa"}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {lang === "en" ? `Manage ${subscribers.length} total subscribers.` : `Subscribers waliigalaa ${subscribers.length} bulchaa.`}
          </p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
          >
            <ArrowDownToLine size={14} />
            {lang === "en" ? "Export to CSV" : "Gara CSVtti Fidi"}
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder={lang === "en" ? "Search subscribers..." : "Subscribers barbaadi..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          <p className="text-slate-500 text-sm font-bold">
            {lang === "en" ? "Loading subscribers..." : "Subscribers fe'amaa jira..."}
          </p>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem] space-y-2">
          <Mail className="mx-auto text-slate-300" size={40} />
          <p className="text-slate-900 font-bold">
            {lang === "en" ? "No subscribers found" : "Subscribers argaman hin jiran"}
          </p>
          <p className="text-slate-400 text-xs">
            {searchQuery ? (lang === "en" ? "Try adjusting your search query." : "Barbaacha keessan sirreessaa.") : (lang === "en" ? "Your newsletter list is empty." : "Hojii oduu haaraa duwwaadha.")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">{lang === "en" ? "Email Address" : "Teessoo Iimeeyilii"}</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{lang === "en" ? "Subscribed Date" : "Guyyaa Guyyeeffame"}</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-4">{lang === "en" ? "Action" : "Hojii"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        @
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{sub.email}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleString() : "N/A"}
                    </div>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors rounded-xl disabled:opacity-50"
                      title={lang === "en" ? "Delete subscriber" : "Haquu"}
                    >
                      {deletingId === sub.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminOrdersDashboard({ lang }: { lang: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Listen to users for mapping userId -> user info
    const qUsers = query(collection(db, "users"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const uMap: Record<string, any> = {};
      snapshot.forEach((doc) => {
        uMap[doc.id] = doc.data();
      });
      setUsersMap(uMap);
    }, (err) => console.error("Error reading users:", err));

    // Listen to orders
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setOrders(list);
      setLoading(false);
    }, (err) => {
      console.error("Error reading orders:", err);
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubOrders();
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status: " + error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(lang === "en" ? "Are you sure you want to delete this order record?" : "Galmee ajaja kana haquu akka barbaaddan mirkaneessaa?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const userEmail = usersMap[order.userId]?.email?.toLowerCase() || "";
    const userName = usersMap[order.userId]?.displayName?.toLowerCase() || "";
    const productName = order.productName?.toLowerCase() || "";
    const matchesSearch = userEmail.includes(searchQuery.toLowerCase()) || 
                          userName.includes(searchQuery.toLowerCase()) || 
                          productName.includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && order.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === "en" ? "Customer Orders" : "Ajajawwan Maamilaa"}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {lang === "en" ? `Monitor and process ${orders.length} total customer purchases.` : `Ajajawwan waliigalaa ${orders.length} hordofaa bulchaa.`}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={lang === "en" ? "Search by email, name or product..." : "Iimeeyilii, maqaa ykn bittaa barbaadi..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-700"
        >
          <option value="all">{lang === "en" ? "All Statuses" : "Haalota Hundumaa"}</option>
          <option value="processing">{lang === "en" ? "Processing" : "Hojiirra jira"}</option>
          <option value="shipped">{lang === "en" ? "Shipped" : "Ergameera"}</option>
          <option value="completed">{lang === "en" ? "Completed" : "Geessifameera"}</option>
          <option value="cancelled">{lang === "en" ? "Cancelled" : "Haqameera"}</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          <p className="text-slate-500 text-sm font-bold">
            {lang === "en" ? "Loading orders..." : "Ajajawwan fe'amaa jiru..."}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem] space-y-2">
          <ShoppingBag className="mx-auto text-slate-300" size={40} />
          <p className="text-slate-900 font-bold">
            {lang === "en" ? "No orders found" : "Ajajawwan argaman hin jiran"}
          </p>
          <p className="text-slate-400 text-xs">
            {searchQuery || statusFilter !== "all" 
              ? (lang === "en" ? "Try adjusting your search filters." : "Sifoo barbaachaa keessan sirreessaa.") 
              : (lang === "en" ? "Your store has not received any orders yet." : "Kuusaan keessan ammatti ajaja hin arganne.")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">{lang === "en" ? "Customer" : "Maamila"}</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{lang === "en" ? "Product & Price" : "Bittaa & Gatii"}</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{lang === "en" ? "Status" : "Haala"}</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{lang === "en" ? "Date" : "Guyyaa"}</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-4">{lang === "en" ? "Actions" : "Hojii"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const userEmail = usersMap[order.userId]?.email || "Unknown Email";
                const userName = usersMap[order.userId]?.displayName || "Unknown User";
                const date = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "N/A";
                const isUpdating = updatingId === order.id;

                let statusColor = "bg-yellow-50 text-yellow-700 border-yellow-100";
                if (order.status?.toLowerCase() === "shipped") statusColor = "bg-blue-50 text-blue-700 border-blue-100";
                if (order.status?.toLowerCase() === "completed" || order.status?.toLowerCase() === "delivered" || order.status?.toLowerCase() === "success") statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                if (order.status?.toLowerCase() === "cancelled") statusColor = "bg-rose-50 text-rose-700 border-rose-100";

                return (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm">{userName}</div>
                        <div className="text-xs text-slate-400 font-medium">{userEmail}</div>
                        
                        {/* Secure P2P Payment Details */}
                        {(order.payerAccount || order.secureTxId) && (
                          <div className="space-y-1 pt-1">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-white ${order.paymentMethod === "telebirr" ? "bg-blue-600" : "bg-purple-700"}`}>
                                {order.paymentMethod === "telebirr" ? "Telebirr" : "CBE Birr"}
                              </span>
                              {order.payerAccount && (
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-extrabold">
                                  Payer: {order.payerAccount}
                                </span>
                              )}
                            </div>
                            {order.secureTxId && (
                              <div className="text-[9px] font-mono font-bold text-slate-500">
                                TxID: {order.secureTxId}
                              </div>
                            )}
                          </div>
                        )}

                        {order.notes && (
                          <div className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block max-w-xs truncate" title={order.notes}>
                            Note: {order.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-sm">{order.productName}</div>
                        <div className="text-xs text-emerald-600 font-extrabold">{order.amount?.toLocaleString()} ETB</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColor}`}>
                        <Clock size={10} />
                        {order.status || "Processing"}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-xs font-semibold">
                      {date}
                    </td>
                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {order.status?.toLowerCase() !== "shipped" && order.status?.toLowerCase() !== "completed" && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, "shipped")}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                            title="Mark as Shipped"
                          >
                            Ship
                          </button>
                        )}
                        {order.status?.toLowerCase() !== "completed" && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, "completed")}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                          title="Delete Order Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminPromotionsDashboard({ products, lang }: { products: any[], lang: string }) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "tiktok" | "facebook" | "standard">("standard");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "promotions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPromotions(list);
      setLoading(false);
    }, (err) => {
      console.error("Error reading promotions:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (prodId === "") {
      setTargetUrl("");
      return;
    }
    const matched = products.find(p => p.id === prodId);
    if (matched) {
      setTitle(matched.name);
      setDescription(matched.description);
      setImageUrl(matched.imageUrl || "");
      // Just set internal link to marketplace tab with specific product ID
      setTargetUrl(`#marketplace-${prodId}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileRef = ref(storage, `promotions/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error(error);
          setUploadingImage(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadUrl);
          setUploadingImage(false);
        }
      );
    } catch (err) {
      console.error(err);
      setUploadingImage(false);
    }
  };

  const handleCreatePromo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const promoData: any = {
        title,
        description,
        platform,
        targetUrl,
        imageUrl,
        createdAt: serverTimestamp()
      };
      if (selectedProductId) {
        promoData.productId = selectedProductId;
        const matched = products.find(p => p.id === selectedProductId);
        if (matched) {
          promoData.productName = matched.name;
        }
      }
      await addDoc(collection(db, "promotions"), promoData);
      
      // Reset
      setTitle("");
      setDescription("");
      setSelectedProductId("");
      setTargetUrl("");
      setImageUrl("");
    } catch (err) {
      console.error("Error creating promotion:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    if (!confirm(lang === "en" ? "Delete this promotion?" : "Beeksiisa kana haquu barbaadduu?")) return;
    try {
      await deleteDoc(doc(db, "promotions", promoId));
    } catch (err) {
      console.error("Error deleting promotion:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Create Promo Panel */}
      <div className="lg:col-span-7 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Megaphone className="text-emerald-500 animate-pulse" size={24} />
            {lang === "en" ? "Promotions & Ads (Beeksiisa)" : "Beeksiisa & Beeksifama"}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {lang === "en" ? "Advertise products, programs, or social networks prominently." : "Oomishaalee ykn sagantaalee addaa gara gabaatti beeksisaa."}
          </p>
        </div>

        <form onSubmit={handleCreatePromo} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              {lang === "en" ? "Select Product to Promote (Optional)" : "Oomisha Beeksifamu Filadhu (Optional)"}
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-700"
            >
              <option value="">{lang === "en" ? "-- Choose Uploaded Product --" : "-- Oomisha Filadhu --"}</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.price} ETB)</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ad Tagline / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Special Offer: 25% OFF on Modern Teff!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description / Offer Details</label>
            <textarea
              rows={3}
              placeholder="Provide a highly converting advertising message..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Social Media / Ad Preset Color</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-700"
              >
                <option value="standard">Standard Emerald (Dure Boru Style)</option>
                <option value="youtube">YouTube Crimson Red ad (🔴)</option>
                <option value="tiktok">TikTok Midnight Neon glow (⚫️)</option>
                <option value="facebook">Facebook Royal Blue ad (🔵)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Promo Image (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-900"
                />
                <label className="px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center cursor-pointer select-none border border-slate-200 text-slate-700">
                  {uploadingImage ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={18} />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Destination URL / Deep Link</label>
            <input
              type="text"
              placeholder="e.g. #marketplace, https://t.me/dureboru"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            {lang === "en" ? "Launch Promoted Ad" : "Beeksiisa Gadi Lakkisi"}
          </button>
        </form>
      </div>

      {/* Preview and Live Ads Panel */}
      <div className="lg:col-span-5 space-y-8">
        {/* Live Card Preview */}
        <div className="bg-slate-50 p-6 rounded-[3rem] border border-slate-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-2">Live Promotion Preview</h3>
          
          <div className="relative overflow-hidden rounded-[2rem] border shadow-md transition-all">
            {platform === "standard" && (
              <div className="bg-emerald-600 text-white p-6 space-y-4 min-h-[160px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                    <Globe size={10} /> Dure Boru Advise
                  </div>
                  <Megaphone size={16} className="text-emerald-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black leading-tight">{title || "Your Promoted Tagline Here"}</h4>
                  <p className="text-xs text-emerald-100 line-clamp-2">{description || "This is how your description will look on the customer's dashboard screen."}</p>
                </div>
                {imageUrl && <img src={imageUrl} alt="Promo" className="w-full h-32 object-cover rounded-xl mt-2" />}
              </div>
            )}

            {platform === "youtube" && (
              <div className="bg-[#FF0000] text-white p-6 space-y-4 min-h-[160px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                    <Youtube size={10} /> Youtube Promoted
                  </div>
                  <Megaphone size={16} className="text-red-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black leading-tight text-white">{title || "Your YouTube style video promo title"}</h4>
                  <p className="text-xs text-red-100 line-clamp-2">{description || "This is tailored with YouTube colors (Crimson Red) to drive direct video course sales or product showcases."}</p>
                </div>
                {imageUrl && <img src={imageUrl} alt="Promo" className="w-full h-32 object-cover rounded-xl mt-2" />}
              </div>
            )}

            {platform === "tiktok" && (
              <div className="bg-[#000000] text-white p-6 space-y-4 min-h-[160px] flex flex-col justify-between border-2 border-cyan-500/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-pink-500/30">
                    <Music size={10} className="text-cyan-400" /> TikTok Trending
                  </div>
                  <Megaphone size={16} className="text-pink-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">{title || "Your TikTok style viral title"}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{description || "Tailored with pitch black and vibrant cyan/neon border overlays for viral digital products."}</p>
                </div>
                {imageUrl && <img src={imageUrl} alt="Promo" className="w-full h-32 object-cover rounded-xl mt-2 border border-pink-500/20" />}
              </div>
            )}

            {platform === "facebook" && (
              <div className="bg-[#1877F2] text-white p-6 space-y-4 min-h-[160px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                    <Facebook size={10} /> Facebook Sponsored
                  </div>
                  <Megaphone size={16} className="text-blue-100" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black leading-tight text-white">{title || "Facebook style sponsored campaign"}</h4>
                  <p className="text-xs text-blue-500/10 line-clamp-2 text-blue-50 font-medium">{description || "Designed with classic royal blue elements to build community trust and boost local website clicks."}</p>
                </div>
                {imageUrl && <img src={imageUrl} alt="Promo" className="w-full h-32 object-cover rounded-xl mt-2" />}
              </div>
            )}
          </div>
        </div>

        {/* Existing Active Promotions List */}
        <div className="bg-white p-6 rounded-[3rem] border border-slate-100 space-y-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-2">
            Active Promotions ({promotions.length})
          </h3>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-emerald-500" size={24} />
            </div>
          ) : promotions.length === 0 ? (
            <p className="text-slate-400 text-xs italic text-center py-6">No active promotions yet. Launch one above!</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {promotions.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {p.platform === "youtube" && <Youtube size={12} className="text-[#FF0000]" />}
                      {p.platform === "tiktok" && <Music size={12} className="text-black" />}
                      {p.platform === "facebook" && <Facebook size={12} className="text-[#1877F2]" />}
                      {p.platform === "standard" && <Globe size={12} className="text-emerald-600" />}
                      <span className="font-bold text-slate-900 text-xs truncate max-w-[150px]">{p.title}</span>
                    </div>
                    {p.productName && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-widest inline-block">
                        Product: {p.productName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePromo(p.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all flex-shrink-0"
                    title="Delete Ad"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AdminPageProps {
  products: any[];
  lang: string;
}

export function AdminPage({ products, lang }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<"products" | "newsletter" | "orders" | "promotions">("products");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Digital Assets",
    imageUrl: "",
    videoUrl: "",
    type: "physical",
    assetType: "other",
    fileUrl: ""
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (file: File, field: "imageUrl" | "videoUrl" | "fileUrl") => {
    if (!file) return;
    setUploadingField(field);
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You could track progress here if needed
        },
        (error) => {
          console.error("Upload error:", error);
          alert("Failed to upload file.");
          setUploadingField(null);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setNewProduct(prev => ({ ...prev, [field]: downloadUrl }));
          setUploadingField(null);
        }
      );
    } catch (err) {
      console.error(err);
      setUploadingField(null);
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: parseFloat(newProduct.price),
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setNewProduct({ 
        name: "", 
        description: "", 
        price: "", 
        category: "Digital Assets", 
        imageUrl: "",
        videoUrl: "",
        type: "physical",
        assetType: "other",
        fileUrl: ""
      });
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium italic">Manage the Dure Boru ecosystem.</p>
          </div>
          {activeTab === "products" && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/10"
            >
              {isAdding ? "Close Panel" : <><Plus size={20} /> Add New Product</>}
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap border-b border-slate-100 mb-8 gap-6">
          <button
            onClick={() => { setActiveTab("products"); setIsAdding(false); }}
            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
              activeTab === "products"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab("newsletter"); setIsAdding(false); }}
            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
              activeTab === "newsletter"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Newsletter
          </button>
          <button
            onClick={() => { setActiveTab("orders"); setIsAdding(false); }}
            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
              activeTab === "orders"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => { setActiveTab("promotions"); setIsAdding(false); }}
            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
              activeTab === "promotions"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Promotions & Ads (Beeksiisa)
          </button>
        </div>

        {activeTab === "products" ? (
          <>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 mb-12"
              >
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Product Name</label>
                  <div className="relative">
                    <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Description</label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium min-h-[120px]"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Product Type</label>
                    <select
                      value={newProduct.type}
                      onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                    >
                      <option value="physical">Physical Product</option>
                      <option value="digital">Digital Asset</option>
                    </select>
                  </div>
                  {newProduct.type === "digital" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Asset Type</label>
                      <select
                        value={newProduct.assetType}
                        onChange={(e) => setNewProduct({ ...newProduct, assetType: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                      >
                        <option value="software">Application Software</option>
                        <option value="video">Video Material</option>
                        <option value="image">Graphic Asset</option>
                        <option value="template">Design Template</option>
                        <option value="book">E-Book/PDF</option>
                        <option value="plan">Work Plan/Guide</option>
                        <option value="ppt">Presentation (PPT)</option>
                        <option value="document">Professional Document</option>
                        <option value="education">Educational Material</option>
                        <option value="other">Other Digital</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Price (ETB)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                      >
                        <option value="General">General</option>
                        <option value="Digital Assets">Digital Assets</option>
                        <option value="Modern Agriculture">Modern Agriculture</option>
                        <option value="Digital Academy">Digital Academy</option>
                        <option value="Software">Software</option>
                        <option value="Video">Video</option>
                        <option value="Image">Image</option>
                        <option value="Templates">Templates</option>
                        <option value="Documents">Documents</option>
                        <option value="Education">Education</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Image URL or Upload</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="url"
                        required
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl px-6 flex items-center justify-center transition-all text-sm font-bold">
                      {uploadingField === "imageUrl" ? <Loader2 className="animate-spin" size={18} /> : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "imageUrl")} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Video URL or Upload (Optional)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="url"
                        value={newProduct.videoUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl px-6 flex items-center justify-center transition-all text-sm font-bold">
                      {uploadingField === "videoUrl" ? <Loader2 className="animate-spin" size={18} /> : "Upload"}
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "videoUrl")} />
                    </label>
                  </div>
                </div>
                {newProduct.type === "digital" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Download/File URL or Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        value={newProduct.fileUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, fileUrl: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl px-6 flex items-center justify-center transition-all text-sm font-bold">
                        {uploadingField === "fileUrl" ? <Loader2 className="animate-spin" size={18} /> : "Upload"}
                        <input type="file" accept="*/*" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], "fileUrl")} />
                      </label>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Save Product"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group">
              <div className="w-full h-48 rounded-3xl bg-slate-100 overflow-hidden mb-6 relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-emerald-600 transition-colors shadow-lg">
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black tracking-tight">{product.name}</h3>
                  <span className="text-emerald-600 font-black">{product.price.toLocaleString()} ETB</span>
                </div>
                <p className="text-slate-500 text-sm font-medium line-clamp-2">{product.description}</p>
                <div className="pt-4 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
            </div>
          </>
        ) : activeTab === "newsletter" ? (
          <AdminNewsletterDashboard lang={lang} />
        ) : activeTab === "orders" ? (
          <AdminOrdersDashboard lang={lang} />
        ) : (
          <AdminPromotionsDashboard products={products} lang={lang} />
        )}
      </div>
    </div>
  );
}
