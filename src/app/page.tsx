"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Merge, Scissors, FileDown, Image, FileImage, RotateCcw, Stamp, Shield, Unlock, PenTool, Layers, ListOrdered, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

const tools = [
  { id: "merge", name: "Merge PDF", desc: "Combine multiple PDFs into one", icon: Merge, href: "/merge", color: "#ff6b4a" },
  { id: "split", name: "Split PDF", desc: "Extract pages from your PDF", icon: Scissors, href: "/split", color: "#00d4ff" },
  { id: "compress", name: "Compress", desc: "Reduce file size instantly", icon: FileDown, href: "/compress", color: "#d4ff00" },
  { id: "to-image", name: "PDF to Image", desc: "Convert pages to JPG/PNG", icon: Image, href: "/pdf-to-image", color: "#ff00d4" },
  { id: "from-image", name: "Image to PDF", desc: "Create PDF from images", icon: FileImage, href: "/image-to-pdf", color: "#ffa500" },
  { id: "rotate", name: "Rotate", desc: "Fix page orientation", icon: RotateCcw, href: "/rotate", color: "#00ffa5" },
  { id: "watermark", name: "Watermark", desc: "Add text watermarks", icon: Stamp, href: "/watermark", color: "#ff4a6b" },
  { id: "protect", name: "Protect", desc: "Password protect PDF", icon: Shield, href: "/protect", color: "#a56bff" },
  { id: "unlock", name: "Unlock", desc: "Remove PDF password", icon: Unlock, href: "/unlock", color: "#6bff4a" },
  { id: "sign", name: "Sign", desc: "Add your signature", icon: PenTool, href: "/sign", color: "#ff6b4a" },
  { id: "organize", name: "Organize", desc: "Reorder and delete pages", icon: Layers, href: "/organize", color: "#00d4ff" },
  { id: "page-numbers", name: "Page Numbers", desc: "Add page numbering", icon: ListOrdered, href: "/page-numbers", color: "#d4ff00" },
];

export default function Home() {
  return (
    <>
      <Header />
      <div className="grid-bg" />
      <main className="min-h-screen pt-32 pb-20">
        <section className="px-4 mb-20 lg:mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-[var(--accent)]" />
                <span className="font-mono text-sm text-[var(--accent)] uppercase tracking-widest">Free and Open Source</span>
              </div>
              <h1 className="heading-xl mb-6">
                <span className="block text-[var(--text-primary)]">Every PDF</span>
                <span className="block text-[var(--text-primary)]">Tool You</span>
                <span className="block text-[var(--accent)]">Need.</span>
              </h1>
              <p className="font-mono text-[var(--text-secondary)] text-lg max-w-xl mb-10 leading-relaxed">
                Merge, split, compress, convert, rotate, watermark and more.
                <span className="text-[var(--text-primary)]"> 100% free. 100% private. </span>
                Files never leave your browser.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#tools" className="btn-brutal">Explore Tools <ArrowRight className="w-4 h-4" /></Link>
                <a href="https://github.com/Keyursinh06-s/filetool" target="_blank" rel="noopener noreferrer" className="btn-ghost">View on GitHub</a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[{ value: "12+", label: "PDF Tools" }, { value: "0", label: "Data Uploaded" }, { value: "∞", label: "Free Uses" }, { value: "<1s", label: "Processing" }].map((stat, i) => (
                <div key={i} className="p-6 border-2 border-[var(--border)] bg-[var(--bg-card)]">
                  <div className="font-display font-bold text-3xl lg:text-4xl text-[var(--accent)] mb-1">{stat.value}</div>
                  <div className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="mb-20 lg:mb-32 overflow-hidden border-y-2 border-[var(--border)] bg-[var(--bg-card)]">
          <div className="marquee py-4">
            <div className="marquee-content">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {tools.map((tool) => (
                    <span key={tool.id + i} className="font-display font-bold text-2xl lg:text-3xl uppercase px-8 text-[var(--text-muted)] whitespace-nowrap">
                      {tool.name}<span className="text-[var(--accent)] mx-4">◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="tools" className="px-4 mb-20 lg:mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="heading-lg mb-4">All Tools<span className="text-[var(--accent)]">.</span></h2>
              <p className="font-mono text-[var(--text-secondary)] max-w-lg">Select a tool below. Everything runs locally in your browser.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <Link href={tool.href}>
                    <div className="card-brutal p-6 h-full group cursor-pointer">
                      <div className="w-12 h-12 flex items-center justify-center mb-4 border-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" style={{ borderColor: tool.color, boxShadow: `3px 3px 0px ${tool.color}` }}>
                        <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">{tool.name}</h3>
                      <p className="font-mono text-sm text-[var(--text-muted)] mb-4">{tool.desc}</p>
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                        <span>Use Tool</span><ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-4 mb-20 lg:mb-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 lg:p-12 border-2 border-[var(--accent)] bg-[var(--bg-card)]">
              <div className="font-mono text-sm text-[var(--accent)] uppercase tracking-widest mb-4">Privacy First</div>
              <h3 className="heading-md mb-4">Your Files Stay On Your Device</h3>
              <p className="font-mono text-[var(--text-secondary)] leading-relaxed">All processing happens locally in your browser. No uploads, no servers, no tracking. Your documents remain 100% private.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 lg:p-12 border-2 border-[var(--border)] bg-[var(--bg-card)]">
              <div className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-widest mb-4">Open Source</div>
              <h3 className="heading-md mb-4">Built in Public Free Forever</h3>
              <p className="font-mono text-[var(--text-secondary)] leading-relaxed">No subscriptions, no limits, no ads. The code is open source on GitHub. Use it, fork it, improve it.</p>
            </motion.div>
          </div>
        </section>
        <footer className="px-4 border-t-2 border-[var(--border)] pt-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="font-display font-bold text-2xl mb-2">FILE<span className="text-[var(--accent)]">TOOL</span></div>
              <p className="font-mono text-sm text-[var(--text-muted)]">Free PDF tools that respect your privacy.</p>
            </div>
            <div className="flex items-center gap-6 font-mono text-sm">
              <a href="https://github.com/Keyursinh06-s/filetool" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">GitHub</a>
              <span className="text-[var(--text-muted)]">© 2025</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
