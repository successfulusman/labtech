"use client";

import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const sections = [
  {
    title: "Acceptance of Terms",
    text: "By accessing or using LabTech's platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.",
  },
  {
    title: "User Accounts",
    text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration.",
  },
  {
    title: "Acceptable Use",
    text: "Users agree not to misuse the platform, attempt unauthorized access, interfere with other users, or use the platform for any unlawful or harmful activities.",
  },
  {
    title: "Intellectual Property",
    text: "All content, software, and materials provided by LabTech remain the intellectual property of LabTech. Users retain ownership of their submitted project data.",
  },
  {
    title: "Limitation of Liability",
    text: "LabTech shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our services are provided on an 'as is' basis.",
  },
  {
    title: "Privacy",
    text: "We are committed to protecting your privacy. All personal data is handled in accordance with our privacy practices and applicable data protection laws.",
  },
];

export function Terms() {
  return (
    <section id="terms" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Terms & <span className="text-secondary">Conditions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-bg-light rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <FiCheckCircle className="w-7 h-7 text-secondary mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
