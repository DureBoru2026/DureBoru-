import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Star, 
  Trash2, 
  Edit2, 
  MessageSquare, 
  Heart, 
  ShoppingCart, 
  Calendar,
  User,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  setDoc,
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface Review {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

interface ProductDetailsModalProps {
  product: any;
  onClose: () => void;
  user: any;
  profile: any;
  wishlist: string[];
  toggleWishlist: (id: string) => Promise<void> | void;
  handleBuyProduct: (product: any) => void;
  currency: "ETB" | "USD";
  EXCHANGE_RATE: number;
  lang: "en" | "om";
  addToast: (title: string, message: string, type?: "success" | "info" | "warning") => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  user,
  profile,
  wishlist,
  toggleWishlist,
  handleBuyProduct,
  currency,
  EXCHANGE_RATE,
  lang,
  addToast
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // Review form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Load reviews from Firestore
  useEffect(() => {
    if (!product?.id) return;

    setLoadingReviews(true);
    const reviewsRef = collection(db, "products", product.id, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Review[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetched);
      setLoadingReviews(false);
    }, (error) => {
      console.error("Error loading product reviews:", error);
      setLoadingReviews(false);
    });

    return () => unsubscribe();
  }, [product?.id]);

  // Check if current user already submitted a review
  const existingUserReview = reviews.find(r => r.userId === user?.uid);

  // Calculate review statistics
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
    : 0;

  // Star counts for summary distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 is 1-star, index 4 is 5-star
  reviews.forEach(r => {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
    ratingCounts[idx]++;
  });

  // Handle submit review (create or update)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast(
        lang === "en" ? "Authentication Required" : "Kaffaltii/Galmee Barbaachisa",
        lang === "en" ? "Please sign in to write a product review." : "Maaloo yaada kee kennuuf jalqaba seeni.",
        "warning"
      );
      return;
    }

    if (!comment.trim()) {
      addToast(
        lang === "en" ? "Comment Required" : "Yaadni Barbaachisaadha",
        lang === "en" ? "Please write a comment for your review." : "Maaloo yaada madaallii kee barreessi.",
        "warning"
      );
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        productId: product.id,
        userId: user.uid,
        authorName: profile?.displayName || user.displayName || "Anonymous User",
        authorPhoto: profile?.photoURL || user.photoURL || "",
        rating,
        comment: comment.trim(),
        updatedAt: new Date().toISOString()
      };

      if (editingReviewId) {
        // Edit existing review
        const reviewDocRef = doc(db, "products", product.id, "reviews", editingReviewId);
        await updateDoc(reviewDocRef, reviewData);
        addToast(
          lang === "en" ? "Review Updated" : "Madaalliin Haaromfameera",
          lang === "en" ? "Your review has been successfully updated!" : "Yaadni fi madaalliin kee milkiidhaan haaromfameera!",
          "success"
        );
        setEditingReviewId(null);
      } else if (existingUserReview) {
        // Already exists, modify it
        const reviewDocRef = doc(db, "products", product.id, "reviews", existingUserReview.id);
        await updateDoc(reviewDocRef, reviewData);
        addToast(
          lang === "en" ? "Review Updated" : "Madaalliin Haaromfameera",
          lang === "en" ? "Your review has been successfully updated!" : "Yaadni fi madaalliin kee milkiidhaan haaromfameera!",
          "success"
        );
      } else {
        // Create new review
        const newReviewRef = doc(collection(db, "products", product.id, "reviews"));
        await setDoc(newReviewRef, {
          ...reviewData,
          createdAt: new Date().toISOString()
        });
        addToast(
          lang === "en" ? "Review Submitted" : "Madaalliin Ergameera",
          lang === "en" ? "Thank you for reviewing this product!" : "Oomisha kana madaaluu keessaniif galatoomaa!",
          "success"
        );
      }

      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      addToast(
        lang === "en" ? "Submission Failed" : "Erguun Hin Milkoofne",
        lang === "en" ? "There was an error saving your review. Please try again." : "Yaada kee olkaa'uu irratti dogoggorri uumameera.",
        "warning"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm(lang === "en" ? "Are you sure you want to delete this review?" : "Madaallii kana haqachuu ni barbaaddaa?")) return;

    try {
      await deleteDoc(doc(db, "products", product.id, "reviews", reviewId));
      addToast(
        lang === "en" ? "Review Deleted" : "Madaalliin Haqameera",
        lang === "en" ? "The review has been removed." : "Madaalliin haqameera.",
        "success"
      );
      if (editingReviewId === reviewId) {
        setEditingReviewId(null);
        setComment("");
        setRating(5);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      addToast(
        lang === "en" ? "Error" : "Dogoggora",
        lang === "en" ? "Failed to delete review." : "Madaallii haqachuu hin dandeenye.",
        "warning"
      );
    }
  };

  // Start editing a review
  const handleStartEdit = (rev: Review) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setComment(rev.comment);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setComment("");
    setRating(5);
  };

  // Format timestamp nicely
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(lang === "en" ? "en-US" : "om-ET", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return isoStr;
    }
  };

  // Calculate local currency price
  const displayPrice = currency === "ETB" 
    ? `${product.price.toLocaleString()} ETB` 
    : `$${(product.price / EXCHANGE_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all shadow-sm cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal content - Scrollable container */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-10 lg:p-12 space-y-10">
          
          {/* Top Section: Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Product Image */}
            <div className="lg:col-span-5 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 relative group flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="text-slate-200">
                  <ShoppingCart size={96} />
                </div>
              )}
              
              {/* Overlay Category Tag */}
              <span className="absolute bottom-6 left-6 px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                {product.category}
              </span>
            </div>

            {/* Right: Product Meta & Core actions */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                {/* Stock Tag */}
                <div>
                  {product.inStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {lang === "en" ? "In Stock" : "Harka irra jira"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-full border border-rose-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      {lang === "en" ? "Out of Stock" : "Dhumeera"}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h2>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  {product.description || product.desc || (lang === "en" ? "No full description provided." : "Ibsi bal'aa hin argamne.")}
                </p>
              </div>

              {/* Purchase Box */}
              <div className="bg-slate-50 p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    {lang === "en" ? "Price Value" : "Gatii Oomishaa"}
                  </span>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {displayPrice}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Heart / Wishlist icon */}
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      wishlist.includes(product.id) 
                        ? "bg-rose-500 text-white hover:bg-rose-600" 
                        : "bg-white text-slate-400 hover:text-rose-500 border border-slate-200"
                    }`}
                    title={lang === "en" ? "Add to Wishlist" : "Kufaamatti dabaladhu"}
                  >
                    <Heart size={24} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Purchase Button */}
                  <button 
                    disabled={!product.inStock}
                    onClick={() => {
                      onClose();
                      handleBuyProduct(product);
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md ${
                      product.inStock 
                        ? "bg-slate-900 hover:bg-black text-white hover:shadow-lg active:scale-95" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <ShoppingCart size={16} />
                    <span>{lang === "en" ? "Buy Now" : "Bitadhu"}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Social Proof Star Ratings & Reviews Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50/50 p-6 sm:p-8 rounded-[2.5rem] border border-slate-100">
            
            {/* Summary aggregate rating score */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100">
              <span className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{averageRating || "0.0"}</span>
              <div className="flex items-center gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= Math.round(averageRating);
                  return (
                    <Star 
                      key={star} 
                      size={18} 
                      className={filled ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                    />
                  );
                })}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                {reviewCount} {reviewCount === 1 ? (lang === "en" ? "Review" : "Yaada") : (lang === "en" ? "Reviews" : "Yaadoota")}
              </p>
            </div>

            {/* Visual Breakdown of ratings percentage bar */}
            <div className="md:col-span-8 space-y-2 px-2 sm:px-6">
              {[5, 4, 3, 2, 1].map((starIdx) => {
                const count = ratingCounts[starIdx - 1];
                const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                
                return (
                  <div key={starIdx} className="flex items-center gap-4 text-xs">
                    <span className="w-12 font-black text-slate-500 text-right flex items-center justify-end gap-1">
                      {starIdx} <Star size={12} className="text-amber-400 fill-amber-400 inline" />
                    </span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                    <span className="w-8 font-bold text-slate-400 text-left">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Section: Active Reviews List and Review submission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Feed of reviews (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                <MessageSquare size={20} className="text-emerald-600" />
                <span>{lang === "en" ? "Customer Reviews" : "Yaada Maamiltootaa"}</span>
                <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                  {reviewCount}
                </span>
              </h3>

              {loadingReviews ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-slate-50/50 border border-dashed border-slate-200 p-12 rounded-3xl text-center">
                  <p className="text-slate-400 text-sm font-medium italic">
                    {lang === "en" 
                      ? "No reviews yet. Be the first to build social proof for this product!" 
                      : "Madaalliin jalqabaa hin ergamne. Ati jalqabi yaada kee barreessi!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  {reviews.map((rev) => {
                    const isAuthor = user && rev.userId === user.uid;
                    const isSystemAdmin = profile?.role === "admin";
                    
                    return (
                      <motion.div 
                        key={rev.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 relative group"
                      >
                        {/* Reviewer Meta & Action Controls */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            {rev.authorPhoto ? (
                              <img 
                                src={rev.authorPhoto} 
                                alt={rev.authorName} 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                                <User size={16} />
                              </div>
                            )}

                            <div>
                              <h4 className="font-black text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                                {rev.authorName}
                                {isAuthor && (
                                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                                    You
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                                <Calendar size={10} />
                                {formatDate(rev.createdAt)}
                                {rev.updatedAt && rev.updatedAt !== rev.createdAt && (
                                  <span className="italic">({lang === "en" ? "edited" : "haaromfame"})</span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Controls (Edit / Delete) */}
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {isAuthor && (
                              <button 
                                onClick={() => handleStartEdit(rev)}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title={lang === "en" ? "Edit review" : "Gulaali"}
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            {(isAuthor || isSystemAdmin) && (
                              <button 
                                onClick={() => handleDeleteReview(rev.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title={isSystemAdmin && !isAuthor ? (lang === "en" ? "Moderate (Delete as Admin)" : "Haqi (Akka Admin)") : (lang === "en" ? "Delete review" : "Haqi")}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Rating stars of review */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-100"} 
                            />
                          ))}
                        </div>

                        {/* Review text content */}
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {rev.comment}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Write a Review Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">
                  {editingReviewId 
                    ? (lang === "en" ? "Edit Your Review" : "Yaada Kee Gulaali")
                    : existingUserReview 
                      ? (lang === "en" ? "Your Review" : "Madaallii Kee") 
                      : (lang === "en" ? "Write a Review" : "Yaada Barreessi")}
                </h3>
                {editingReviewId && (
                  <button 
                    onClick={handleCancelEdit}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!user ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center space-y-3 shadow-sm">
                  <ShieldAlert size={28} className="text-amber-500 mx-auto" />
                  <p className="text-xs font-medium text-slate-500">
                    {lang === "en" 
                      ? "You must be logged in to leave a review and rate this product." 
                      : "Madaallii kennuufi gosa oomishaa madaaluuf galmaa'uun seenuun dirqama."}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Sign in to get started
                  </p>
                </div>
              ) : existingUserReview && !editingReviewId ? (
                /* Already wrote review and not currently editing, show completed state with edit option */
                <div className="bg-white p-6 rounded-2xl border border-emerald-100 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Review Completed</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= existingUserReview.rating ? "text-amber-400 fill-amber-400" : "text-slate-100"} 
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs italic leading-relaxed line-clamp-4">
                      "{existingUserReview.comment}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => handleStartEdit(existingUserReview)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 hover:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit Review</span>
                    </button>
                    <button
                      onClick={() => handleDeleteReview(existingUserReview.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-500 hover:text-rose-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Form for write/edit review */
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Stars select box */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      {lang === "en" ? "Select Star Rating" : "Madaallii Gosa Koroo Filadhu"}
                    </label>
                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200/60 shadow-inner">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isHighlighted = hoverRating !== null 
                          ? star <= hoverRating 
                          : star <= rating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                          >
                            <Star 
                              size={28} 
                              className={isHighlighted ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                            />
                          </button>
                        );
                      })}
                      <span className="ml-auto text-xs font-black text-slate-500">
                        {rating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Comment Text Area */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      {lang === "en" ? "Write Review Details" : "Yaada Bal'aa Barreessi"}
                    </label>
                    <div className="relative">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 500))}
                        placeholder={lang === "en" ? "Tell others about your experience..." : "Yaada gabaasa qorannoo kee barreessi..."}
                        className="w-full h-32 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-slate-400 shadow-inner resize-none"
                        required
                      />
                      <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold bg-slate-50/80 backdrop-blur px-1.5 py-0.5 rounded border">
                        {comment.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 hover:shadow-xl active:scale-98"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : editingReviewId ? (
                      lang === "en" ? "Update Review" : "Haaromsi Yaada"
                    ) : (
                      lang === "en" ? "Submit Review" : "Madaallii Ergi"
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};
