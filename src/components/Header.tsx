"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ArrowUpRight } from "lucide-react";

const tools = [
  { name: "Merge", href: "/merge" },
  { name: "Split", href: "/split" },
  { name: "Compress", href: "/compress" },
  { name: "Convert", href: "/pdf-to-image" },
  { name: "Rotate", href: "/rotate" },
  { name: "Sign", href: "/sign" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-[var(--accent)] flex items-center justify-center border-2 border-[var(--text-primary)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
                  <FileText className="w-5 h-5 text-[var(--bg-primary)]" strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                  FILE<span className="text-[var(--accent)]">TOOL</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="px-4 py-2 text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-all uppercase tracking-wider"
                  >
                    {tool.name}
                  </Link>
                ))}
                <Link
                  href="/"
                  className="ml-2 px-4 py-2 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  All Tools →
                </Link>
              </nav>

              {/* CTA + Mobile Toggle */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Keyursinh06-s/filetool"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-[var(--border)] text-sm font-mono hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                >
                  GitHub <ArrowUpRight className="w-3 h-3" />
                </a>
                
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden w-10 h-10 flex items-center justify-center border-2 border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[88px] z-40 lg:hidden"
          >
            <nav className="bg-[var(--bg-card)] border-2 border-[var(--border)] border-t-0 p-4">
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool, i) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={tool.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-sm font-mono uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-mono text-[var(--accent)] uppercase tracking-wider"
                >
                  View All Tools →
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
