"use client";

import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Lab<span className="text-secondary">Tech</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Empowering businesses with cutting-edge technology solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Web Development</li>
              <li>App Development</li>
              <li>AI Solutions</li>
              <li>Cyber Security</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#developers">Our Team</Link></li>
              <li><Link href="#contact">Contact</Link></li>
              <li><Link href="#terms">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <FiGithub className="w-5 h-5 text-gray-400 hover:text-secondary cursor-pointer" />
              <FiTwitter className="w-5 h-5 text-gray-400 hover:text-secondary cursor-pointer" />
              <FiLinkedin className="w-5 h-5 text-gray-400 hover:text-secondary cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          &copy; 2026 LabTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
