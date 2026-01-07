"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import {
  Merge,
  Split,
  FileDown,
  Image,
  FileImage,
  RotateCcw,
  Lock,
  Unlock,
  Stamp,
  PenTool,
  ListOrdered,
  FileSignature,
  Layers,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    icon: Merge,
    href: "/merge",
    color: "#667eea",
  },
  {
    title: "Split PDF",
    description: "Extract pages or split into multiple files",
    icon: Split,
    href: "/split",
    color: "#f093fb",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size for easy sharing",
    icon: FileDown,
    href: "/compress",
    color: "#4ade80",
  },
  {
    title: "PDF to Image",
    description: "Convert PDF pages to JPG or PNG",
    icon: Image,
    href: "/pdf-to-image",
    color: "#fb923c",
  },
  {
    title: "Image to PDF",
    description: "Convert images to PDF format",
    icon: FileImage,
    href: "/image-to-pdf",
    color: "#38bdf8",
  },
  {
    title: "Rotate PDF",
    description: "Rotate pages to correct orientation",
    icon: RotateCcw,
    href: "/rotate",
    color: "#a78bfa",
  },
  {
    title: "Page Numbers",
    description: "Add page numbers to your PDF",
    icon: ListOrdered,
    href: "/page-numbers",
    color: "#06b6d4",
  },
  {
    title: "Watermark",
    description: "Add text or image watermarks",
    icon: Stamp,
    href: "/watermark",
    color: "#eab308",
  },
  {
    title: "Protect PDF",
    description: "Add password protection",
    icon: Lock,
    href: "/protect",
    color: "#f43f5e",
  },
  {
    title: "Unlock PDF",
    description: "Remove password protection",
    icon: Unlock,
    href: "/unlock",
    color: "#14b8a6",
  },
  {
    title: "Sign PDF",
    description: "Add your signature to documents",
    icon: FileSignature,
    href: "/sign",
    color: "#8b5cf6",
  },
  {
    title: "Organize PDF",
    description: "Delete, reorder & manage pages",
    icon: Layers,
    href: "/organize",
    color: "#ec4899",
  },
];

const stats = [
  { value: "10M+", label: "PDFs Processed" },
  { value: "100%", label: "Free Forever" },
  { value: "256-bit", label: "Encryption" },
  { value: "0", label: "Files Stored" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass mb-6 sm:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-white/70">100% Free • No Registration • No Limits</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 px-2">
              <span className="text-white">Every tool to work</span>
              <br />
              <span className="gradient-text">with PDFs in one place</span>
            </h1>

            <motion.p
              className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Merge, split, compress, convert, sign, and edit PDFs with ease.
              All processing happens in your browser — your files never leave your device.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass rounded-xl p-3 sm:p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-xl sm:text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-white/50 text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-2 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {["Fast", "Secure", "Private", "No Upload"].map((badge, i) => (
                <motion.span
                  key={badge}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-white/70 text-xs sm:text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
              All PDF Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {tools.map((tool, index) => (
                <ToolCard
                  key={tool.title}
                  {...tool}
                  delay={0.9 + index * 0.03}
                />
              ))}
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="mt-16 sm:mt-32 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Why choose our PDF tools?
            </h2>
            <p className="text-white/60 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Built with modern technology for the best experience
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {[
                {
                  icon: Shield,
                  title: "100% Private",
                  desc: "Files are processed locally in your browser. Nothing is uploaded to any server.",
                  color: "#4ade80",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Modern WebAssembly technology for instant processing without waiting.",
                  color: "#facc15",
                },
                {
                  icon: Globe,
                  title: "Works Offline",
                  desc: "Once loaded, works without internet. Perfect for sensitive documents.",
                  color: "#38bdf8",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="glass rounded-2xl p-6 sm:p-8 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <feature.icon
                    className="w-8 h-8 sm:w-10 sm:h-10 mb-4"
                    style={{ color: feature.color }}
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            className="mt-16 sm:mt-32"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">
              Perfect for everyone
            </h2>
            <p className="text-white/60 mb-8 sm:mb-12 max-w-2xl mx-auto text-center text-sm sm:text-base px-4">
              Whether you&apos;re a student, professional, or business owner
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { emoji: "🎓", title: "Students", desc: "Merge assignments, compress for email" },
                { emoji: "💼", title: "Professionals", desc: "Sign contracts, protect documents" },
                { emoji: "🏢", title: "Businesses", desc: "Watermark, organize & secure files" },
                { emoji: "⚖️", title: "Legal", desc: "Redact info, add page numbers" },
              ].map((useCase, i) => (
                <motion.div
                  key={useCase.title}
                  className="glass rounded-xl p-5 sm:p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="text-3xl sm:text-4xl mb-3 block">{useCase.emoji}</span>
                  <h3 className="text-white font-semibold mb-1">{useCase.title}</h3>
                  <p className="text-white/50 text-sm">{useCase.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs sm:text-sm text-center sm:text-left">
            © 2024 LovePDF Clone. All processing happens in your browser.
          </p>
          <div className="flex gap-4 sm:gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/50 hover:text-white text-xs sm:text-sm transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
