"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "./Header";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  icon: Icon,
  color,
  children,
}: ToolLayoutProps) {
  return (
    <>
      <Header />
      <div className="grid-bg" />
      
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8 uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Tools</span>
            </Link>
          </motion.div>

          {/* Tool Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-start gap-5 mb-4">
              <div
                className="w-14 h-14 flex items-center justify-center border-2 flex-shrink-0"
                style={{ 
                  borderColor: color,
                  boxShadow: `4px 4px 0px ${color}`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              
              <div>
                <h1 className="font-display font-bold text-3xl lg:text-4xl text-[var(--text-primary)] mb-2">
                  {title}
                </h1>
                <p className="font-mono text-[var(--text-secondary)]">
                  {description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tool Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </>
  );
}
