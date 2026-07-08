"use client";

import { motion } from "framer-motion";

const developers = [
  { name: "Saad Ali", role: "Super Admin", category: "Full Stack", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=saad" },
  { name: "Ahmed Khan", role: "Web Head", category: "Web", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed" },
  { name: "Sara Ahmed", role: "App Head", category: "App", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara" },
  { name: "Usman Malik", role: "AI Head", category: "AI", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman" },
  { name: "Fatima Zia", role: "Cyber Head", category: "Cyber Security", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima" },
  { name: "Ali Raza", role: "Developer", category: "Web", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali" },
];

export function Developers() {
  return (
    <section id="developers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Meet Our <span className="text-secondary">Team</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Talented professionals dedicated to delivering excellence
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-bg-light rounded-2xl p-6 text-center group cursor-pointer hover:shadow-xl transition-all"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-secondary"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
              </motion.div>
              <h3 className="text-xl font-bold text-primary mb-1">{dev.name}</h3>
              <p className="text-secondary font-semibold mb-2">{dev.role}</p>
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {dev.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
