"use client";

import { motion } from "framer-motion";
import { FiGlobe, FiSmartphone, FiCpu, FiShield } from "react-icons/fi";

const features = [
  {
    icon: FiGlobe,
    title: "Web Development",
    description: "Modern responsive web applications using cutting-edge technologies.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FiSmartphone,
    title: "App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FiCpu,
    title: "AI Solutions",
    description: "Intelligent automation and machine learning solutions for your business.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: FiShield,
    title: "Cyber Security",
    description: "Comprehensive security solutions to protect your digital assets.",
    color: "from-red-500 to-orange-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Our <span className="text-secondary">Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive technology solutions across four key domains
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-bg-light rounded-2xl p-8 text-center group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
