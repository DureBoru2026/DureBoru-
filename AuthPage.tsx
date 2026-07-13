import React, { FormEvent } from "react";
import { motion } from "motion/react";
import { Loader2, ArrowRight, User, Mail, Lock, ShieldCheck } from "lucide-react";

interface AuthPageProps {
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
  email: string;
  setEmail: (e: string) => void;
  password: string;
  setPassword: (e: string) => void;
  name: string;
  setName: (e: string) => void;
  error: string;
  handleAuth: (e: FormEvent) => void;
  handleGoogleSignIn: () => void;
  handleForgotPassword: () => void;
  resetSent: boolean;
  lang: string;
}

export function AuthPage({ 
  mode, setMode, email, setEmail, password, setPassword, name, setName, error, handleAuth, handleGoogleSignIn, handleForgotPassword, resetSent, lang 
}: AuthPageProps) {
  const isAdmin = (email: string) => ["iresojemal44@gmail.com", "jemalfano030@gmail.com"].includes(email.toLowerCase().trim());

  return (
    <div className="min-h-screen bg-[#fdfcf8] pt-32 pb-20 px-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
              {mode === "login" 
                ? (isAdmin(email) ? "Welcome Back Admin" : (lang === "en" ? "Welcome Back" : "Baga Nagaan Deebitan")) 
                : (lang === "en" ? "Create Account" : "Hiriira Banadhu")}
            </h1>
            <p className="text-slate-500 font-medium italic">
              {lang === "en" ? "Join the Ethiopian digital revolution." : "Inqilaaba dijitaalaa Itoophiyaatti makamaa."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mb-8"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Or Email</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jemal Fano"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
                {isAdmin(email) && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                    <ShieldCheck size={10} />
                    Admin
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="space-y-3">
                <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100 px-4">
                  {error}
                </p>
                {mode === "login" && error.includes("Incorrect email or password") && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-full text-xs font-black uppercase tracking-widest text-emerald-600 hover:underline"
                  >
                    Forgot Password? Reset it here
                  </button>
                )}
              </div>
            )}

            {resetSent && (
              <p className="text-emerald-600 text-sm font-bold text-center bg-emerald-50 py-3 rounded-xl border border-emerald-100 px-4">
                Password reset link sent! Check your email.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl mt-4"
            >
              {mode === "login" ? "Sign In" : "Get Started"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {mode === "login" ? (lang === "en" ? "Don't have an account? Create one" : "Hiriira hin qabduu? Banadhu") : (lang === "en" ? "Already have an account? Sign in" : "Hiriira qabduu? Gali")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
