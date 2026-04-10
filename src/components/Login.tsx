import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "motion/react";
import { Lock, User as UserIcon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showBypass, setShowBypass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegistering) {
        // Strict restriction for registration
        if (email !== "adminsimpluse@gmail.com" || password !== "admin2026") {
          setError("Pendaftaran hanya diizinkan untuk akun admin utama dengan kredensial yang ditentukan.");
          setLoading(false);
          return;
        }
        const { createUserWithEmailAndPassword } = await import("firebase/auth");
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      if (err.code === "auth/network-request-failed") {
        setError("Koneksi ke Firebase terputus. Ini biasanya karena Ad-blocker atau Firewall di browser Anda.");
        setShowBypass(true);
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email atau password salah. Silakan periksa kembali.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar. Silakan langsung Login.");
      } else if (err.code === "auth/weak-password") {
        setError("Password terlalu lemah. Gunakan minimal 6 karakter.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Metode Login Email/Password belum diaktifkan di Firebase Console.");
      } else {
        setError(`Terjadi kesalahan: ${err.code || "Unknown error"}. Silakan coba lagi.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    // This is a temporary bypass for testing if Firebase is unreachable
    // In a real app, you'd never do this, but for this preview environment it helps
    if (email === "adminsimpluse@gmail.com" && password === "admin2026") {
      // We simulate a user object for the context
      const mockUser = { uid: "bypass-admin", email: "adminsimpluse@gmail.com" } as any;
      // We can't easily set the auth state globally without Firebase, 
      // but we can tell the user to try disabling ad-blockers.
      setError("Bypass diaktifkan (Hanya untuk simulasi). Namun, Dashboard tetap membutuhkan koneksi database agar bisa menyimpan data.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-3xl glass border border-white/10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">{isRegistering ? "Admin Register" : "Admin Login"}</h1>
          <p className="text-text-secondary">Simpluse Web Project</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Email (Gunakan format email)</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-colors"
                placeholder="adminsimpluse@gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Processing..." : (isRegistering ? "Register" : "Login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-brand-orange hover:underline"
          >
            {isRegistering ? "Sudah punya akun? Login di sini" : "Belum punya akun? Register di sini"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
