"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-20 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-primary mb-6">
              About <span className="text-secondary">LabTech</span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              LabTech is a premier technology solutions provider specializing in Web Development,
              Mobile Applications, Artificial Intelligence, and Cyber Security. Our team of expert
              developers and engineers work tirelessly to deliver cutting-edge solutions.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              With over 500+ successful projects and a team of 100+ skilled professionals,
              we have established ourselves as a trusted partner for businesses worldwide.
            </p>
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: "500+", label: "Projects" },
                { value: "100+", label: "Experts" },
                { value: "50+", label: "Clients" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-secondary">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-1">
              <div className="bg-white rounded-3xl p-8">
                <div className="space-y-4">
                  {[
                    "Agile Development Methodology",
                    "24/7 Technical Support",
                    "100% Client Satisfaction",
                    "Latest Tech Stack",
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
