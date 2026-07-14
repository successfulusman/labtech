"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in!");
        router.push("/dashboard");
      }
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Account created! Please login.");
        setIsLogin(true);
      } else {
        const data = await res.json();
        toast.error(data.error || "Signup failed");
      }
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-dark flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left - Brand Side */}
            <motion.div
              className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary to-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="text-4xl font-bold text-white mb-4">
                Lab<span className="text-secondary">Tech</span>
              </Link>
              <p className="text-gray-300 text-center text-lg">
                {isLogin ? "Welcome back to innovation" : "Join the future of tech"}
              </p>
              <div className="mt-8 w-16 h-1 bg-secondary rounded-full" />
              <p className="text-gray-400 text-sm mt-4 text-center">
                Web • App • AI • Cyber Security
              </p>
            </motion.div>

            {/* Right - Form Side */}
            <div className="p-8 md:p-12 relative">
              <div className="absolute top-4 right-4">
                <Link
                  href="/"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  ← Home
                </Link>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="perspective-1000"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
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
                    )}
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
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                    >
                      {isLogin ? "Sign In" : "Sign Up"}
                    </motion.button>
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
                    <motion.button
                      onClick={() => handleOAuth("google")}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-all"
                    >
                      <FcGoogle className="w-5 h-5" />
                      Google
                    </motion.button>
                    <motion.button
                      onClick={() => handleOAuth("github")}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-all"
                    >
                      <FiGithub className="w-5 h-5" />
                      GitHub
                    </motion.button>
                  </div>

                  <p className="text-gray-400 text-sm text-center mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-secondary hover:underline ml-1 font-semibold"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
