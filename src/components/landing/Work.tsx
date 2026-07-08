"use client";

import { motion } from "framer-motion";
import { FiCheck, FiArrowUpRight } from "react-icons/fi";

const projects = [
  {
    title: "Web Development",
    image: "/images/web.jpg",
    tagline: "Modern web applications",
    points: ["E-commerce Platforms", "Business Websites", "SaaS Dashboards", "SEO Optimized"],
    description: "Scalable, responsive and lightning-fast web applications built with the latest frameworks and best practices.",
  },
  {
    title: "App Development",
    image: "/images/app.jpg",
    tagline: "Mobile-first experiences",
    points: ["iOS & Android Apps", "Cross-platform", "UI/UX Design", "App Store Launch"],
    description: "Native and cross-platform mobile apps with smooth, intuitive interfaces that users love.",
  },
  {
    title: "AI Solutions",
    image: "/images/ai.jpg",
    tagline: "Intelligent automation",
    points: ["Machine Learning", "Chatbots", "Data Analytics", "Process Automation"],
    description: "Cutting-edge AI and machine learning solutions that turn your data into intelligent decisions.",
  },
  {
    title: "Cyber Security",
    image: "/images/cyber.jpg",
    tagline: "Protect your business",
    points: ["Penetration Testing", "Security Audits", "Threat Monitoring", "Data Protection"],
    description: "Comprehensive security solutions that safeguard your digital assets and customer data.",
  },
];

export function Work() {
  return (
    <section id="work" className="py-20 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Our <span className="text-secondary">Work</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hover over the cards to explore what we deliver for our clients
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-96 [perspective:1000px]"
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-white/80 text-sm">{project.tagline}</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-white p-6 flex flex-col justify-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                    <span className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                      <FiArrowUpRight className="w-5 h-5 text-primary" />
                    </span>
                  </div>
                  <ul className="space-y-3 mb-5">
                    {project.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-gray-600 text-sm">
                        <FiCheck className="w-4 h-4 text-secondary shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
