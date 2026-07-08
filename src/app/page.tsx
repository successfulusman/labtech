"use client";

import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Work } from "@/components/landing/Work";
import { About } from "@/components/landing/About";
import { Developers } from "@/components/landing/Developers";
import { Contact } from "@/components/landing/Contact";
import { Terms } from "@/components/landing/Terms";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Work />
      <Developers />
      <Contact />
      <About />
      <Terms />
      <Footer />
    </main>
  );
}
