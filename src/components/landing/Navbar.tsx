"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className={`text-2xl font-bold ${scrolled ? "text-primary" : "text-white"}`}>
            Lab<span className="text-secondary">Tech</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className={`${scrolled ? "text-gray-600 hover:text-primary" : "text-white/80 hover:text-white"} transition-colors`}>Features</Link>
            <Link href="#about" className={`${scrolled ? "text-gray-600 hover:text-primary" : "text-white/80 hover:text-white"} transition-colors`}>About</Link>
            <Link href="#developers" className={`${scrolled ? "text-gray-600 hover:text-primary" : "text-white/80 hover:text-white"} transition-colors`}>Developers</Link>
            <Link href="#contact" className={`${scrolled ? "text-gray-600 hover:text-primary" : "text-white/80 hover:text-white"} transition-colors`}>Contact</Link>
            <Link
              href="/signup"
              className={`${scrolled ? "border-primary text-primary" : "border-white text-white"} border-2 px-6 py-2 rounded-full hover:bg-secondary hover:text-white hover:border-secondary transition-colors`}
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className={`${scrolled ? "bg-primary" : "bg-secondary"} text-white px-6 py-2 rounded-full hover:bg-primary-light transition-colors`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
