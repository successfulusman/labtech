"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiCode, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "WEB", label: "Web Development" },
  { value: "APP", label: "App Development" },
  { value: "AI", label: "AI Solutions" },
  { value: "CYBER_SECURITY", label: "Cyber Security" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
    category: "WEB",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created! Please login.");
        router.push("/login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white">
              Lab<span className="text-secondary">Tech</span>
            </Link>
            <p className="text-gray-400 text-sm mt-2">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "DEVELOPER", label: "Developer" },
                { value: "CLIENT", label: "Client" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: opt.value })}
                  className={`py-3 rounded-xl font-semibold border-2 transition-all ${
                    form.role === opt.value
                      ? "bg-secondary/20 border-secondary text-white"
                      : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {form.role === "DEVELOPER" && (
              <div className="relative">
                <FiCode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-primary text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-primary text-gray-400">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-all"
            >
              <FcGoogle className="w-5 h-5" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-all"
            >
              <FiGithub className="w-5 h-5" />
              GitHub
            </button>
          </div>

          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary hover:underline ml-1 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
