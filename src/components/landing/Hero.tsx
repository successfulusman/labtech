"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#3b82f6] via-[#5aa0f7] to-[#2563eb]">
      <div className="absolute inset-0">
        <img
          src="/images/web.jpg"
          alt="LabTech work"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/50 via-[#3b82f6]/60 to-[#1d4ed8]/70" />
      </div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Innovate with{" "}
            <span className="text-secondary">LabTech</span>
          </motion.h1>
            <motion.p
              className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
            Empowering businesses with cutting-edge Web, App, AI, and Cyber Security solutions. 
            We transform ideas into digital reality.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/signup"
              className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
